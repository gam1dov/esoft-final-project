import { NextFunction, type Request, type Response } from "express";
import { db } from "../config/db.js";
import { type OrderInsert, type CartItem } from "../config/types.js";
import { sql } from "kysely";

// POST /api/orders
export async function addOrderItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      orderItems: requestedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    if (requestedItems && requestedItems.length === 0) {
      res.status(400);
      throw new Error("Нет заказа");
    } else {
      const user = await db
        .selectFrom("users")
        .where("id", "=", req.user.id)
        .select(["id", "name", "email", "is_admin"])
        .executeTakeFirstOrThrow();

      const orderInsert: OrderInsert = {
        user_id: req.user.id,
        payment_method: paymentMethod,
        items_price: itemsPrice,
        shipping_price: shippingPrice,
        total_price: totalPrice,
        shipping_address: shippingAddress,
        is_paid: false,
        is_delivered: false,
        paid_at: null,
        delivered_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const { id } = await db
        .insertInto("orders")
        .values(orderInsert)
        .returning("id")
        .executeTakeFirstOrThrow();

      const orderItemsInsert = requestedItems.map((item: CartItem) => ({
        order_id: id,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images[0],
      }));

      await db.insertInto("order_items").values(orderItemsInsert).execute();

      const savedOrderItems = await db
        .selectFrom("order_items")
        .where("order_id", "=", id)
        .selectAll()
        .execute();

      const response = {
        id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        shippingAddress,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        orderItems: savedOrderItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      };

      res.status(201).json(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// GET /api/orders/myorders
export async function getMyOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = db
      .selectFrom("orders")
      .where("user_id", "=", req.user.id)
      .select((e) => e.fn.count<number>("id").as("total"));

    const countResult = await count.executeTakeFirst();
    const totalOrders = countResult?.total || 0;
    const totalPages = Math.ceil(totalOrders / pageSize);

    const orders = await db
      .selectFrom("orders")
      .where("user_id", "=", req.user.id)
      .select([
        "id",
        "is_delivered",
        "is_paid",
        "delivered_at",
        "paid_at",
        "total_price",
        "created_at",
      ])
      .orderBy("created_at", "desc")
      .limit(pageSize)
      .offset(pageSize * (page - 1))
      .execute();

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      isDelivered: order.is_delivered,
      isPaid: order.is_paid,
      deliveredAt: order.delivered_at,
      paidAt: order.paid_at,
      totalPrice: order.total_price,
      createdAt: order.created_at,
    }));

    res.json({
      orders: formattedOrders,
      page,
      pageSize,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// GET /api/orders/:id
export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const orderId = req.params.id;
    const order = await db
      .selectFrom("orders")
      .where("orders.id", "=", orderId)
      .selectAll("orders")
      .executeTakeFirst();

    if (!order) {
      res.status(404);
      throw new Error("Заказ не найден");
    }

    const user = await db
      .selectFrom("users")
      .where("id", "=", order.user_id)
      .select(["id", "name", "email", "is_admin"])
      .executeTakeFirstOrThrow();

    const orderItems = await db
      .selectFrom("order_items")
      .where("order_id", "=", orderId)
      .select(["id", "product_id", "name", "quantity", "price", "image"])
      .execute();

    const response = {
      id: order.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
      paymentMethod: order.payment_method,
      itemsPrice: order.items_price,
      shippingPrice: order.shipping_price,
      totalPrice: order.total_price,
      shippingAddress: order.shipping_address,
      isPaid: order.is_paid,
      isDelivered: order.is_delivered,
      createdAt: order.created_at,
      deliveredAt: order.delivered_at,
      paidAt: order.paid_at,
      orderItems: orderItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
    };

    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// PUT /api/orders/:id/paid
export async function updateOrderPaid(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const orderId = req.params.id;
    const { isPaid, paidAt } = req.body;

    const updatedOrder = await db
      .updateTable("orders")
      .set({
        is_paid: isPaid,
        paid_at: new Date(paidAt),
      })
      .where("id", "=", orderId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedOrder) {
      res.status(404);
      throw new Error("Заказ не найден");
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// PUT /api/orders/:id/delivered
export async function updateOrderDelivered(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const orderId = req.params.id;
    const updatedOrder = await db
      .updateTable("orders")
      .set({
        is_delivered: true,
        delivered_at: new Date(),
      })
      .where("id", "=", orderId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedOrder) {
      res.status(404);
      throw new Error("Заказ не найден");
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// GET /api/orders
export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const [
      countResult,
      salesResult,
      usersResult,
      productsResult,
      latestSales,
      salesDataRaw,
    ] = await Promise.all([
      db
        .selectFrom("orders")
        .select((e) => e.fn.count<number>("id").as("countOrders"))
        .executeTakeFirst(),

      db
        .selectFrom("orders")
        .select((e) => e.fn.sum<number>("total_price").as("countSales"))
        .executeTakeFirst(),

      db
        .selectFrom("users")
        .select((e) => e.fn.count<number>("id").as("countUsers"))
        .executeTakeFirst(),

      db
        .selectFrom("products")
        .select((e) => e.fn.count<number>("id").as("countProducts"))
        .executeTakeFirst(),

      db
        .selectFrom("orders")
        .innerJoin("users", "users.id", "orders.user_id")
        .select([
          "orders.id",
          "orders.created_at as createdAt",
          "orders.total_price as totalPrice",
          "users.name as userName",
        ])
        .orderBy("orders.created_at", "desc")
        .limit(10)
        .execute(),

      db
        .selectFrom("orders")
        .select([
          () => sql<string>`to_char(created_at, 'MM/YY')`.as("month"),
          (e) => e.fn.sum("total_price").as("totalSales"),
        ])
        .groupBy("month")
        .orderBy("month")
        .execute(),
    ]);

    const totalOrders = countResult?.countOrders || 0;
    const totalPages = Math.ceil(totalOrders / pageSize);
    const totalSales = salesResult?.countSales ?? 0;
    const totalUsers = usersResult?.countUsers || 0;
    const totalProducts = productsResult?.countProducts || 0;

    const salesData = salesDataRaw.map((entry) => ({
      month: entry.month,
      totalSales: Number(entry.totalSales),
    }));

    const orders = await db
      .selectFrom("orders")
      .innerJoin("users", "users.id", "orders.user_id")
      .select([
        "orders.id",
        "orders.created_at",
        "orders.total_price",
        "orders.is_paid",
        "orders.is_delivered",
        "orders.paid_at",
        "orders.delivered_at",
        "users.id as userId",
        "users.name as userName",
      ])
      .orderBy("orders.created_at", "desc")
      .limit(pageSize)
      .offset(pageSize * (page - 1))
      .execute();

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.created_at,
      totalPrice: order.total_price,
      isPaid: order.is_paid,
      isDelivered: order.is_delivered,
      paidAt: order.paid_at || null,
      deliveredAt: order.delivered_at || null,
      user: order.userName,
    }));

    const formattedLatestSales = latestSales.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
      userName: order.userName,
    }));

    res.status(200).json({
      orders: formattedOrders,
      latestSales: formattedLatestSales,
      salesData,
      page,
      totalPages,
      totalOrders: Number(totalOrders),
      totalSales: Number(totalSales),
      totalUsers: Number(totalUsers),
      totalProducts: Number(totalProducts),
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}
