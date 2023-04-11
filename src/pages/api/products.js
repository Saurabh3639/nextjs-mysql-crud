import { query } from "@/lib/db";

export default async function handler(req, res) {
  let message;

  // For Get data
  if (req.method === "GET") {
    const products = await query({
      query: "SELECT * FROM products",
      values: [],
    });
    res.status(200).json({ products: products });
  }

  // For Add data
  if (req.method === "POST") {
    const productName = req.body.pname;
    const productDesc = req.body.pdesc;
    const productImage = req.body.pimage;
    const addProducts = await query({
      // query: "INSERT INTO products (pname) VALUES (?)",
      query: "INSERT INTO products (pname, pdesc, pimage) VALUES (?, ?, ?)",
      values: [productName, productDesc, productImage],
    });
    let product = [];
    if (addProducts.insertId) {
      message = "success";
    } else {
      message = "error";
    }
    product = {
      pid: addProducts.insertId,
      pname: productName,
      pdesc: productDesc,
      pimage: productImage,
    };
    res.status(200).json({ response: { message: message, product: product } });
  }

  // For Update data
  if (req.method === "PUT") {
    const productId = req.body.pid;
    const productName = req.body.pname;
    const productDesc = req.body.pdesc;
    const productImage = req.body.pimage;
    const updateProducts = await query({
      query: "UPDATE products SET pname = ?, pdesc = ?, pimage = ? WHERE pid = ?",
      values: [productName, productDesc, productImage, productId],
    });
    const result = updateProducts.affectedRows;
    if (result) {
      message = "success";
    } else {
      message = "error";
    }
    const product = {
      pid: productId,
      pname: productName,
      pdesc: productDesc,
      pimage: productImage,
    };
    res.status(200).json({ response: { message: message, product: product } });
  }

  // For Delete data
  if (req.method === "DELETE") {
    const productId = req.body.pid;
    const deleteProducts = await query({
      query: "DELETE FROM products WHERE pid = ?",
      values: [productId],
    });
    const result = deleteProducts.affectedRows;
    if (result) {
      message = "success";
    } else {
      message = "error";
    }
    res
      .status(200)
      .json({ response: { message: message, pid: productId } });
  }
}
