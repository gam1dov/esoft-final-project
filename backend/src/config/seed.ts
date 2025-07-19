import { db } from "../config/db.js";
import products from "../models/products.js";
import users from "../models/users.js";

async function importData() {
  try {
    await db.deleteFrom("products").execute();
    await db.deleteFrom("users").execute();

    if (users.length === 0) {
      throw new Error("Нет пользователей для импорта.");
    }

    let adminUserId: string | null = null;

    for (const user of users) {
      const result = await db
        .insertInto("users")
        .values({
          name: user.name,
          email: user.email,
          password: user.password,
          is_admin: user.isAdmin,
        })
        .returning("id")
        .executeTakeFirst();

      if (user.isAdmin && result) {
        adminUserId = result.id;
      }
    }

    if (!adminUserId) {
      const firstUser = await db
        .selectFrom("users")
        .select("id")
        .limit(1)
        .executeTakeFirst();

      adminUserId = firstUser?.id ?? null;
    }

    if (!adminUserId) {
      throw new Error("Не удалось определить ID пользователя для товаров.");
    }

    for (const product of products) {
      await db
        .insertInto("products")
        .values({
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.category,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          num_reviews: product.numReviews,
          user_id: adminUserId,
        })
        .execute();
    }

    console.log(`Успешно добавлено ${products.length} товаров`);
    console.log(`Успешно добавлено ${users.length} пользователей`);
    process.exit(0);
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error);
    process.exit(1);
  }
}

async function destroyData() {
  try {
    await db.deleteFrom("products").execute();
    await db.deleteFrom("users").execute();
    console.log("Данные успешно удалены!");
    process.exit(0);
  } catch (error) {
    console.error("Произошла ошибка при удалении данных:", error);
    process.exit(1);
  }
}

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
