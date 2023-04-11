import { useEffect, useState, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const productNameRef = useRef();
  const productDescRef = useRef();
  const productImageRef = useRef();

  const productIDToDeleteRef = useRef();

  const productIDToUpdateRef = useRef();
  const productNameToUpdateRef = useRef();
  const productDescToUpdateRef = useRef();
  const productImageToUpdateRef = useRef();

  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [updatedError, setUpdatedError] = useState(false);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedError, setDeletedError] = useState(false);

  // Get products
  async function getProducts() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch("http://localhost:3000/api/products", postData);
    const response = await res.json();
    setProducts(response.products);
    console.log(response);
  }

  // Add product
  async function addProduct() {
    const productName = productNameRef.current.value.trim();
    const productDesc = productDescRef.current.value.trim();
    const productImage = productImageRef.current.value.trim();

    if (productName.length < 3) return;
    if (productDesc.length < 3) return;
    if (productImage.length < 3) return;

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pname: productName,
        pdesc: productDesc,
        pimage: productImage,
      }),
    };

    if (productName.length < 3) return;
    if (productDesc.length < 3) return;
    if (productImage.length < 3) return;

    const res = await fetch("http://localhost:3000/api/products", postData);

    const response = await res.json();
    console.log(response);

    if (response.response.message !== "success") return;
    const newproduct = response.response.product;

    setProducts([
      ...products,
      {
        pid: newproduct.pid,
        pname: newproduct.pname,
        pdesc: newproduct.pdesc,
        pimage: newproduct.pimage,
      },
    ]);
    setCreated(true);
  }

  // Update product
  async function updateProduct() {
    const productIDToUpdate = productIDToUpdateRef.current.value.trim();
    const productNameToUpdate = productNameToUpdateRef.current.value.trim();
    const productDescToUpdate = productDescToUpdateRef.current.value.trim();
    const productImageToUpdate = productImageToUpdateRef.current.value.trim();

    if (!productIDToUpdate.length) return;
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: productIDToUpdate,
        pname: productNameToUpdate,
        pdesc: productDescToUpdate,
        pimage: productImageToUpdate,
      }),
    };
    
    const res = await fetch("http://localhost:3000/api/products", postData);
    const response = await res.json();

    if (response.response.message === "error") return setUpdatedError(true);
    const productIdUpdated = parseFloat(response.response.product.pid);
    const productUpdatedName = response.response.product.pname;
    const productUpdatedDesc = response.response.product.pdesc;
    const productUpdatedImage = response.response.product.pimage;

    //updating state
    const productsStateAfterUpdate = products.map((product) => {
      if (product.pid === productIdUpdated) {
        const productUpdated = {
          ...product,
          pname: productUpdatedName,
          pdesc: productUpdatedDesc,
          pimage: productUpdatedImage,
        };
        return productUpdated;
      } else {
        return {
          ...product,
        };
      }
    });
    setUpdated(true);
    setProducts(productsStateAfterUpdate);
  }

  // Delete product
  async function deleteProduct(id) {
    if (!id) return;
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: id,
      }),
    };
    const res = await fetch("http://localhost:3000/api/products", postData);
    const response = await res.json();
    console.log(response.response);
    if (response.response.message === "error") return setDeletedError(true);
    const idToRemove = parseFloat(response.response.pid);
    setProducts(products.filter((a) => a.pid !== idToRemove));
    setDeleted(true);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {" "}
      <Head>
        <title>CRUD With Next.Js & MySQL</title>
      </Head>
      <div className={styles.container}>
        <section className={styles.main}>
          <h1>CRUD With Next.Js & MySQL</h1>
          <div className={styles.heading}>
            <a href="/api/products" target="_blank" rel="noreferrer">
              Database API data
            </a>
          </div>
        </section>

        {/* Read Product Data */}
        <section>
          <div className={styles.read}>
            <h2>Read</h2>
            <div className={styles.products}>
              {products.map((item, index) => {
                return (
                  <div key={item.pid} className={styles.product}>
                    <span>pid</span>: {item.pid} <br /> <span>pname</span>:{" "}
                    {item.pname} <br /> <span>pdesc</span>: {item.pdesc} <br />{" "}
                    <span>pimage</span>: {item.pimage}{" "}
                    <CiTrash
                      className={styles.icons}
                      onClick={() => deleteProduct(item.pid)}
                    />
                  </div>
                );
              })}
              {!products.length ? <>No products found</> : null}
            </div>
          </div>
        </section>

        {/* Create Product Data */}
        <section>
          <div className={styles.create}>
            <h2>Create</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Description</div>
              <input type="text" ref={productDescRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Image</div>
              <input type="text" ref={productImageRef} />
            </div>
            {created ? <div className={styles.success}>Success!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Save"
                type="button"
                onClick={addProduct}
              />
            </div>
          </div>
        </section>

        {/* Update Product Data */}
        <section>
          <div className={styles.update}>
            <h2>Update</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Description</div>
              <input type="text" ref={productDescToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Image</div>
              <input type="text" ref={productImageToUpdateRef} />
            </div>
            {updated ? <div className={styles.success}>Success!</div> : null}
            {updatedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Update"
                type="button"
                onClick={updateProduct}
              />
            </div>
          </div>
        </section>

        {/* Update Delete Data */}
        <section>
          <div className={styles.delete}>
            <h2>Delete</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToDeleteRef} />
            </div>
            {deleted ? <div className={styles.success}>Success!</div> : null}
            {deletedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={`${styles.button} ${styles.warning}`}
                value="Delete"
                type="button"
                onClick={() =>
                  deleteProduct(productIDToDeleteRef.current.value)
                }
              />
            </div>
          </div>
        </section>

        <footer>
          <p>&copy; Next-MySQL CRUD App</p>
        </footer>
      </div>
    </>
  );
}
