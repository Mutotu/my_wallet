import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { selectData } from "../store/user/userSlice";
import { useSelector } from "react-redux";

const DEFAULT_VALUES = {
  pickUser: "",
  amountToSend: null,
  isSelected: false,
  receiver: {
    id: null,
    name: "",
    accountNumber: null,
    username: ""
  }
}

const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
const baseURL = 'http://localhost:8080'
const TransferPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([])
  const [state, setState] = useState(DEFAULT_VALUES)
  const selectedData = useSelector(selectData);
  const { id } = selectedData


  const handleClick = (id, username = undefined, fullName, accountNumber) => {
    setState((prev) => ({
      ...prev,
      isSelected: true,
      receiver: {
        id: id,
        name: fullName,
        accountNumber: accountNumber,
        username: username,
      },
    }));
  }
  const handleClickSend = () => {
    if (!state.amountToSend && typeof state.amountToSend === "number") {
      console.log("Nothing entered")
      return
    }
    fetch(`${baseURL}/withdrawal`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ userId: Number(id), amount: Number(state.amountToSend) }),
      redirect: 'follow',
    })
      .then((res) => {
        if (!res.ok) {
          console.log("NOt wirhdrwan")
          throw new Error('Withdrawl request is higher than balance')
        }
        if (res.status === 201) {
          fetch(`${baseURL}/deposit`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ userId: Number(state.receiver.id), amount: Number(state.amountToSend) }),
            redirect: 'follow',
          })
          setState(DEFAULT_VALUES)
          navigate("/")
        }
      })

  }
  useEffect(() => {
    fetch(`${baseURL}/users`, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }).then((res) => {
      if (res.status === 200) {
        return res.json()
      }
    }).then(res => {
      setUsers(res)
    })
  }, [])
  return <div className="transfer-container">
    {state.isSelected ? (
      <div className="send-money">
        <h2>How much would you like to send?</h2>
        <div className="amount-input">
          $<input
            value={state.amountToSend}
            onChange={(e) =>
              setState((pre) => ({ ...pre, amountToSend: e.target.value }))
            }
          />
        </div>
        <h3>Receiver: {state.receiver.name}</h3>
        <h3>
          Amount you'd like to send to{" "}
          <span style={{ textDecoration: "underline" }}>
            {state.receiver.name.split(" ")[0]}
          </span>
          : ${state.amountToSend}
        </h3>
        <button className="send-button" onClick={handleClickSend}>
          Send
        </button>
      </div>
    ) : (
      <div className="select-receiver">
        <h3>Who would you like to send money?</h3>
        <input
          value={state.pickUser}
          type="text"
          onChange={(e) =>
            setState((pre) => ({ ...pre, pickUser: e.target.value }))
          }
        />
        {users
          .filter(
            (user) =>
              user.fullName.toLowerCase().includes(state.pickUser.toLowerCase()) &&
              state.pickUser.length !== 0
          )
          .map((user) => (
            <ul key={user.id}>
              <li className="user-item">
                <h5>Name: {user.fullName}</h5>
                <h4>Account number: {user.accountNumber}</h4>
                <button
                  className="select-button"
                  onClick={() =>
                    handleClick(user.id, user.username, user.fullName, user.accountNumber)
                  }
                >
                  Select
                </button>
              </li>
            </ul>
          ))}
      </div>
    )}
  </div>

}

export default TransferPage