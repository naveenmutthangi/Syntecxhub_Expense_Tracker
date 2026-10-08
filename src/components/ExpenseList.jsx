import { memo } from "react";
import { categoryInfo } from "../categories";

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="message">No expenses found.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((item) => {
        // fall back to "Other" if the category isn't in the list
        const info = categoryInfo[item.category] || categoryInfo.Other;

        return (
          <li key={item.id} className="expense-item" style={{ borderLeftColor: info.color }}>
            <div className="item-left">
              <span className="icon" style={{ backgroundColor: info.color + "26" }}>
                {info.emoji}
              </span>
              <div>
                <h4>{item.title}</h4>
                <small>
                  <span className="badge" style={{ color: info.color }}>
                    {item.category}
                  </span>{" "}
                  | {item.date}
                </small>
              </div>
            </div>
            <div className="item-right">
              <span className="amount">${item.amount.toFixed(2)}</span>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default memo(ExpenseList);