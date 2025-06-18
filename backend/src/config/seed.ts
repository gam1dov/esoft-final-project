import { query } from "./db.js";
import products from "../data/products.js";

async function importData() {
  try {
    // await query("DELETE FROM users");
    await query("DELETE FROM products");

    const insertQuery = `
      INSERT INTO products (
        name,
        description,
        price,
        images,
        category,
        brand,
        stock,
        rating,
        "numReviews",
        "isFeatured",
        banner
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    for (const product of products) {
      await query(insertQuery, [
        product.name,
        product.description,
        product.price,
        product.images,
        product.category,
        product.brand,
        product.stock,
        product.rating,
        product.numReviews,
        product.isFeatured,
        product.banner,
      ]);
    }

    console.log(`Успешно добавлено ${products.length} товаров`);
    process.exit();
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error);
    process.exit(1);
    // throw error;
  }
}

async function destroyData() {
  try {
    // await query("DELETE FROM users");
    await query("DELETE FROM products");

    console.log("Данные успешно удалены!");
    process.exit();
  } catch (error) {
    console.log("Произошла ошибка при удалении данных!");
    process.exit(1);
  }
}

// importData()
//   .then(() => process.exit(0))
//   .catch(() => process.exit(1));
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
