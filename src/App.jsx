import { useState, useEffect, useMemo, useCallback } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Charts from "./components/Charts";
import { categories, categoryInfo } from "./categories";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // load starting data from the mock api (public/expenses.json)
  useEffect(() => {
    fetch("/expenses.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load expenses");
        }
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // useCallback so the child components don't re-render every time
  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // only recalculate when expenses or filter change
  const filteredExpenses = useMemo(() => {
    const list = filter === "All" ? expenses : expenses.filter((item) => item.category === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, filter]);

  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  // totals for each category (used by the pie chart and top category card)
  const categoryData = useMemo(() => {
    const totals = {};
    expenses.forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });
    return Object.keys(totals)
      .map((name) => ({
        name: name,
        value: totals[name],
        color: (categoryInfo[name] || categoryInfo.Other).color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // totals for each day (used by the bar chart)
  const dailyData = useMemo(() => {
    const totals = {};
    expenses.forEach((item) => {
      totals[item.date] = (totals[item.date] || 0) + item.amount;
    });
    return Object.keys(totals)
      .sort()
      .map((date) => ({
        day: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: totals[date],
      }));
  }, [expenses]);

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  return (
    <div className="app">
      <header className="header">
        <h1>💸 Expense Tracker</h1>
        <p>Keep track of where your money goes</p>
      </header>

      <div className="stats">
        <div className="stat-card blue">
          <p>Total Spent</p>
          <h2>${total.toFixed(2)}</h2>
        </div>
        <div className="stat-card green">
          <p>Number of Expenses</p>
          <h2>{expenses.length}</h2>
        </div>
        <div className="stat-card orange">
          <p>Top Category</p>
          <h2>
            {topCategory
              ? (categoryInfo[topCategory.name] || categoryInfo.Other).emoji + " " + topCategory.name
              : "-"}
          </h2>
        </div>
      </div>

      {!loading && !error && <Charts categoryData={categoryData} dailyData={dailyData} />}

      <div className="main">
        <div className="card">
          <h3>Add New Expense</h3>
          <ExpenseForm onAdd={addExpense} categories={categories} />
        </div>

        <div className="card">
          <div className="list-header">
            <h3>History</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryInfo[cat].emoji} {cat}
                </option>
              ))}
            </select>
          </div>

          {loading && <p className="message">Loading...</p>}
          {error && <p className="message error">{error}</p>}
          {!loading && !error && (
            <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;