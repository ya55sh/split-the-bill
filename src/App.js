import React, { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 1,
    name: "Jack",
    img: "https://randomuser.me/api/portraits/med/men/75.jpg",
    balance: -10,
  },
  {
    id: 2,
    name: "Ross",
    img: "https://randomuser.me/api/portraits/med/men/95.jpg",
    balance: 20,
  },
  {
    id: 3,
    name: "Mahila Aayog",
    img: "https://randomuser.me/api/portraits/med/women/68.jpg",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState("");
  const [billValue, setBill] = useState(null);

  function setShowAddFriendHandler() {
    setShowAddFriend((show) => !show);
  }

  function setFriendsHandler(friendData) {
    setFriends((prevState) => [...prevState, friendData]);
    setShowAddFriendHandler(false);
  }

  function setSelectFriendHandler(friend) {
    setSelectFriend((curr) => (curr?.id === friend.id ? null : friend));
  }

  function setSplitBillHandler(val) {
    setBill(val);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          setSelectFriendHandler={setSelectFriendHandler}
          // billInfo={billInfo}
          selectFriend={selectFriend}
        />
        {showAddFriend && <AddFriend setFriendsHandler={setFriendsHandler} />}
        <Button onClick={setShowAddFriendHandler}>
          {showAddFriend ? "Cancel" : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <AddBill
          selectFriend={selectFriend}
          setSplitBillHandler={setSplitBillHandler}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, setSelectFriendHandler, selectFriend }) {
  return (
    <ul className="friend-list">
      {friends.map((friend) => {
        return (
          <Friend
            key={friend.id}
            friend={friend}
            setSelectFriendHandler={setSelectFriendHandler}
            selectFriend={selectFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friend, setSelectFriendHandler, selectFriend }) {
  let selectedClass = friend.id === selectFriend?.id ? "selected" : "";

  return (
    <li className={`list ${selectedClass}`}>
      <div className="list-container">
        <img src={friend.img} alt={friend.name} />
        <div>
          <h3>{friend.name}</h3>
          <h5>
            {friend.balance < 0 && (
              <p className="red">You owe {friend.balance * -1}!</p>
            )}

            {friend.balance > 0 && (
              <p className="green">Owes you {friend.balance}!</p>
            )}

            {friend.balance === 0 && (
              <p className="grey">You and {friend.name} are even!</p>
            )}
          </h5>
        </div>
      </div>
      <Button onClick={() => setSelectFriendHandler(friend)}>
        {selectedClass ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ setFriendsHandler }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/75");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    } else {
      let id = crypto.randomUUID();

      let friendData = {
        id,
        name,
        img: `${image}?u=${id}`,
        balance: 0,
      };
      setName("");
      setImage("https://i.pravatar.cc/75");
      setFriendsHandler(friendData);
    }
  }

  return (
    <form className="add-friend" onSubmit={handleSubmit}>
      <div className="input-label">
        <label className="label-item">
          Friend's Name:
          <input
            name="friend-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="label-item">
          Image URL:
          <input
            name="friend-name"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
      </div>
      <Button>Add</Button>
    </form>
  );
}

function AddBill({ selectFriend, setSplitBillHandler }) {
  const [billAmount, setBillAmount] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  let friendsExpense = billAmount - yourExpense;

  function handleSubmit(e) {
    e.preventDefault();

    if (!billAmount || !yourExpense) return;

    setSplitBillHandler(whoIsPaying === "user" ? friendsExpense : -yourExpense);
    setBillAmount("");
    setYourExpense("");
  }

  return (
    <form className="bill-bar" onSubmit={handleSubmit}>
      <h1>Split the bill with {selectFriend.name}</h1>
      <div className="input-label">
        <label className="label-item">
          Bill amount:
          <input
            name="bill-amount"
            type="text"
            value={billAmount}
            onChange={(e) => setBillAmount(Number(e.target.value))}
          />
        </label>

        <label className="label-item">
          Your expense:
          <input
            name="your-expense"
            type="text"
            value={yourExpense}
            onChange={(e) =>
              setYourExpense(
                Number(e.target.value) > billAmount
                  ? yourExpense
                  : Number(e.target.value)
              )
            }
          />
        </label>

        <label className="label-item">
          {selectFriend.name}'s expense:
          <input
            name="their-expense"
            type="text"
            style={{ background: "white" }}
            disabled
            value={billAmount ? friendsExpense : ""}
          />
        </label>

        <label className="drop-down-label">
          <span>Who is paying:</span>
          <select onChange={(e) => setWhoIsPaying(e.target.value)}>
            <option value="user">You</option>
            <option value="friend">{selectFriend.name}</option>
          </select>
        </label>
      </div>

      <Button>Split Bill</Button>
    </form>
  );
}
