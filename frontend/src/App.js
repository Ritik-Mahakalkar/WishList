import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const API = 'http://localhost:3000/wishlist';
const userId = 101;

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: null, item_name: '', description: '', link: '', priority: 'Medium' });

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${API}/${userId}`);
      setItems(data);
    } catch {
      alert('Failed to fetch wishlist');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ id: null, item_name: '', description: '', link: '', priority: 'Medium' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      form.id
        ? await axios.put(`${API}/${form.id}`, form)
        : await axios.post(API, { ...form, user_id: userId });
      resetForm();
      fetchWishlist();
    } catch {
      alert('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchWishlist();
      } catch {
        alert('Failed to delete item');
      }
    }
  };

  const getBadgeColor = (priority) =>
    priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'secondary';

  return (
    <div className="container py-5" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
     

      <div className="card p-4 shadow-lg border-0 mb-5 glass">
        <h4 className="mb-4">{form.id ? ' Edit Item' : 'Add to Wishlist'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control form-control-lg"
              name="item_name"
              placeholder="Item Name"
              value={form.item_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              name="link"
              placeholder="Purchase Link (optional)"
              value={form.link}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="High">High Priority</option>
              <option value="Medium"> Medium Priority</option>
              <option value="Low"> Low Priority</option>
            </select>
          </div>
          <button className="btn btn-success w-100 shadow-sm">
            {form.id ? ' Update Item' : 'Add Item'}
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted">No items yet. Start adding some dreams! </p>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 wishlist-item hover-scale">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{item.item_name}</h5>
                  {item.link && (
                    <a href={item.link} className="mb-2 d-block text-decoration-none" target="_blank" rel="noreferrer">
                      🔗 <small>{item.link}</small>
                    </a>
                  )}
                  <p className="text-muted">{item.description}</p>
                  <span className={`badge bg-${getBadgeColor(item.priority)} mb-3`}>
                    {item.priority}
                  </span>
                  <div className="mt-auto d-flex justify-content-between">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setForm(item)}>
                       Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)}>
                       Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
