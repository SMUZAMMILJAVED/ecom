import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };
  async function saveCategory(ev) {
    ev.preventDefault();
    if (!name.trim()) {
      swal.fire({
        title: "Error",
        text: "Please enter a category name.",
        icon: "error",
      });
      return; // Exit the function if the category name is empty
    }
    const data = { name, parentCategory,
      properties:properties.map(p=>({name:p.name,values:p.values.split(',')}))
     };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory('');
    setProperties([])
    fetchCategory();
  }
  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties.map(({name,values})=>({
      name,
      values:values.join(',')
    })))
  };
  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategory();
        }
      });
  };
  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  };
  const handlePropertyNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };
  const removeProperty=(indexToRemove)=>{
    setProperties(prev=>{
      return [...prev].filter((p,pIndex)=>{
    return pIndex !== indexToRemove;
      })
    })
  }
  return (
    <Layout>
      <h1>
        <b>Categories</b>
      </h1>
      <label>
        {editedCategory
          ? `Edit Categorry ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className=""
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  placeholder="property name (example:color)"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                />
                <input
                  className="mb-0"
                  type="text"
                  placeholder="values , comma seprated"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                />
                <button
                type="button" onClick={()=>removeProperty(index)} className="btn-red">remove</button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
        {editedCategory &&(
          <button onClick={()=>{
            setEditedCategory(null);
            setName('');
            setParentCategory('');
            setProperties([]);
          }} type="button" className="btn-default">Cancel</button>
        )}
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
        </div>
        
      </form>
      {!editedCategory &&(
        <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className="btn-default mr-1"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-red"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
