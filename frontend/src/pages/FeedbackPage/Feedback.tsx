import React, { useState } from 'react';
import './MessFeedback.css';

// ✅ Form Type
type FormData = {
  student_id: string;
  date: string;
  meal_type: string;
  food_rating: number;
  hygiene_rating: number;
  comments: string;
  special_meal: boolean;
};

// ✅ Restrict rating keys
type RatingKey = 'food_rating' | 'hygiene_rating';

const FeedbackPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    student_id: 'STU2026',
    date: new Date().toLocaleDateString('en-GB'),
    meal_type: 'Breakfast',
    food_rating: 0,
    hygiene_rating: 0,
    comments: '',
    special_meal: false
  });

  // ✅ FIXED handleInputChange (checkbox issue solved)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const newValue =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // ✅ Rating handler
  const handleRating = (category: RatingKey, value: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // ✅ Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.food_rating === 0 || formData.hygiene_rating === 0) {
      alert("Please provide both ratings before submitting.");
      return;
    }

    const dbPayload = {
      feedback_id: `FB-${Date.now()}`,
      student_id: formData.student_id,
      date: formData.date,
      food_rating: formData.food_rating,
      hygiene_rating: formData.hygiene_rating,
      comments: formData.comments
    };

    console.log("Database Object Ready:", dbPayload);
    setSubmitted(true);
  };

  // ✅ Success Screen
  if (submitted) {
    return (
      <div className="feedback-container success-view">
        <div className="success-icon">✓</div>
        <h2>Feedback Submitted Successfully</h2>
        <p>The entry has been logged into the hostel system.</p>
        <button
          className="submit-btn"
          onClick={() => setSubmitted(false)}
          style={{ marginTop: '20px', width: 'auto' }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>Hostel Mess Feedback</h1>
        <p>Your reviews help us improve the daily menu and hygiene.</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="grid-row">
          <div className="field-group">
            <label>Student ID</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="field-group">
            <label>Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Meal Session</label>
          <select
            name="meal_type"
            value={formData.meal_type}
            onChange={handleInputChange}
            className="select-field"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="special_meal"
              checked={formData.special_meal}
              onChange={handleInputChange}
            />
            This was a Special Menu meal
          </label>
        </div>

        {/* ✅ Ratings */}
        {(['food_rating', 'hygiene_rating'] as RatingKey[]).map((ratingKey) => (
          <div key={ratingKey} className="rating-card">
            <label style={{ textTransform: 'capitalize' }}>
              {ratingKey.replace('_', ' ')}
            </label>

            <div className="star-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(ratingKey, star)}
                  className={`star-btn ${
                    formData[ratingKey] >= star
                      ? 'star-active'
                      : 'star-inactive'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="field-group">
          <label>Comments (Optional)</label>
          <textarea
            name="comments"
            rows={3}
            value={formData.comments}
            onChange={handleInputChange}
            placeholder="Tell us more about the food..."
            className="textarea-field"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;