const NewListing = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [img, setImage] = useState("");

  // Ensure these arrays are defined
  const productCategories = [
    { id: 1, name: "Academic Materials" },
    { id: 2, name: "Home Essentials" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Accesories" },
    { id: 5, name: "Technology & Electronics" },
    { id: 6, name: "Food & Beverage" },
    { id: 7, name: "Entertainment" },
    { id: 8, name: "Collectibles" },
    { id: 9, name: "Miscellaneous" },
  ];

  const serviceCategories = [
    { id: 1, name: "Academic Help" },
    { id: 2, name: "Technology Support" },
    { id: 3, name: "Photography & Videography" },
    { id: 4, name: "Beauty & Personal Care" },
    { id: 5, name: "Automotive Services" },
    { id: 6, name: "Creative Work" },
    { id: 7, name: "Pet Services" },
    { id: 8, name: "Entertainment & Event Planning" },
    { id: 9, name: "Miscellaneous" },
  ];

  // Safely determine which categories to display
  const categoriesToDisplay = type === "product" ? productCategories : serviceCategories;

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (!prevSelected) return [categoryId]; // Handle undefined case
      return prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId];
    });
  };

  // Add some debugging
  console.log({
    type,
    categoriesToDisplay,
    selectedCategories
  });

  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt="uc marketplace-logo" />
        <div className="welcome-text">
          <h1>List Product or Service</h1>
        </div>
      </div>

      <div className="listing-form-container">
        <h2>Create a New Listing</h2>
        <form className="listing-form" onSubmit={handleSubmit} method="POST">
          {/* Type Selection */}
          <div className="form-group">
            <label htmlFor="listing-type">Type:</label>
            <select
              id="listing-type"
              name="listingType"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Product or Service Name:"
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter Product or Service Description:"
              rows="5"
              required
            ></textarea>
          </div>

          {/* Add this right after description and before price */}
          <div className="form-group" style={{
            border: '2px solid #ddd',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <label htmlFor="category" style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>Select Categories:</label>
            <div className="category-dropdown" style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {categoriesToDisplay.map((cat) => (
                <div key={cat.id} className="category-option" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  margin: '5px 0',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <input
                    type="checkbox"
                    id={`category-${cat.id}`}
                    value={cat.id}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    style={{
                      marginRight: '10px',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                  <label 
                    htmlFor={`category-${cat.id}`}
                    style={{
                      margin: 0,
                      cursor: 'pointer'
                    }}
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Input */}
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price:"
              required
            />
          </div>

          {/* Quantity Input */}
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter Quantity:"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              value={img}
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              multiple
            />
          </div>

          <button type="submit" className="post-button">
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
}; 