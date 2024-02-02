import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [title, setTitle] = useState(existingTitle || "");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);
  const saveProduct = async (ev) => {
    ev.preventDefault();
    if (!title || !description || !price || images.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please fill all fields.",
        icon: "error",
      });
      return;
    }
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
      // setGoToProducts(true);
    } else {
      //add

      await axios.post("/api/products", data);
      // setGoToProducts(true);
    }
    setGoToProducts(true);
  };
  if (goToProducts) {
    router.push("/products");
  }
  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      //  console.log(res.data)
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  };
  function updateImagesOrder(images) {
    setImages(images);
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };
  //
  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  //
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        type="text"
        placeholder="product name"
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Description</label>
      <textarea
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        placeholder="description"
      ></textarea>
      <label>Price (in Rs.)</label>
      <input
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
        type="number"
        placeholder="Price"
      ></input>
      <label>Photo</label>
      <div className="mb-2 flex flex-wrap gap-1">
      <ReactSortable
  list={images}
  className="flex flex-wrap gap-1"
  setList={updateImagesOrder}
>
  {!!images?.length &&
    images.map((link, index) => (
      <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm relative">
        <img src={link} className="rounded-lg" />
        <button
          onClick={() => handleDeleteImage(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          X
        </button>
      </div>
    ))}
</ReactSortable>
        {/* <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link,index) => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm">
                <img src={link} className="rounded-lg" />

                <button
          onClick={() => handleDeleteImage(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          X
        </button>

              </div>
            ))}
        </ReactSortable> */}
        {isUploading && (
          <div className="h-24 flex items-center ">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer  text-small text-gray-400 rounded-lg bg-white shadow-sm border border-gray-200 text-center flex items-center justify-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input onChange={uploadImages} type="file" className="hidden"></input>
        </label>
        {/* {!images?.length && <div>No Photos In This Product</div>} */}
      </div>

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

export default ProductForm;
