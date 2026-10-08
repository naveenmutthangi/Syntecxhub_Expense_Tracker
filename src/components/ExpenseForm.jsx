import { useState, useRef, useEffect, memo } from "react";
import { categoryInfo } from "../categories";

function ExpenseForm({ onAdd, categories }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const titleInput = useRef(null);

  // focus the first input when the page loads
  useEffect(() => {
    titleInput.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "" || amount === "" || date === "") {
      alert("Please fill in all the fields");
      titleInput.current.focus();
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount should be more than 0");
      return;
    }

    onAdd({
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category: category,
      date: date,
    });

    // clear the form and go back to the first input
    setTitle("");
    setAmount("");
    setDate("");
    titleInput.current.focus();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        ref={titleInput}
        type="text"
        placeholder="Expense name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {categoryInfo[cat].emoji} {cat}
          </option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default memo(ExpenseForm);