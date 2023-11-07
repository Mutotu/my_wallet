import { selectData } from "../store/user/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import SelectForm from "../components/SelectForm"
import { useState, useEffect } from 'react'
import moment from 'moment'
import { updateState, refreshState } from "../store/user/userSlice";
import { useNavigate } from 'react-router-dom';



const DEFAULT = {
  selectedOption: null,
  currency: '',
  hasChanged: false,
  errorMessage: '',
  amount: ""
}
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
const baseURL = 'http://localhost:8080'

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedData = useSelector(selectData);
  const { id, username, fullName, accountNumber, transactions } = selectedData
  const balance = transactions.reduce((acc, curVal) => acc + curVal.amount, 0)

  const [state, setState] = useState(DEFAULT)

  const handleChange = (selectedOption) => {
    setState((prevState) => ({ ...prevState, selectedOption }))
  }

  const handleAmountChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (state.selectedOption === null || state.amount.length === 0) return

    state.selectedOption?.value === 'deposit' &&
      fetch(`${baseURL}/deposit`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ userId: Number(id), amount: Number(state.amount) }),
        redirect: 'follow',
      })
        .then((res) => {
          if (res.status === 201) {
            return res.json()
          }
        })
        .then((r) => {
          setState(DEFAULT)
          setState((pre) => ({ ...pre, hasChanged: true, errorMessage: '' }))
        })
    state.selectedOption?.value === 'withdraw' &&
      fetch(`${baseURL}/withdrawal`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ userId: Number(id), amount: Number(state.amount) }),
        redirect: 'follow',
      })
        .then((res) => {
          if (!res.ok) {
            setState((pre) => ({
              ...pre,
              errorMessage: 'Withdrawl request is higher than balance',
            }))
            throw new Error('Withdrawl request is higher than balance')
          }
          if (res.status === 201) {
            return res.json()
          }
        })
        .then((r) => {
          setState(DEFAULT)
          setState((pre) => ({ ...pre, hasChanged: true, errorMessage: '' }))
        })
        .catch((er) => {
          console.log(er)
        })
  }
  const handleClick = () => {
    dispatch(refreshState())
    navigate("/signin")
  }
  useEffect(() => {
    if (!id) navigate("/signin")
    if (username, accountNumber) {
      fetch(`${baseURL}/auth`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ username, accountNumber }),
        redirect: 'follow',
      }).then((res) => {
        if (res.status === 201) {
          return res.json()
        }
        return "Username doesn't exist"

      })
        .then((res) => {
          dispatch(updateState(res.user));
        })
      setState((pre) => ({ ...pre, hasChanged: false }))
    }

  }, [state.hasChanged])

  return <div>
    <button style={{ position: "absolute", right: "10px" }} onClick={handleClick}>Log out</button>
    <div className="header">
      <h5>Welcome {fullName.split(' ')}</h5>
      <h5 className="sectionHeading">CURRENT BALANCE</h5>
      <p className="dinero">{`$${parseFloat(balance)} `}</p>
    </div>
    <SelectForm state={state} handleSubmit={handleSubmit} handleChange={handleChange} handleAmountChange={handleAmountChange} />
    <div>
      <div className="sub">
        <div>
          <button onClick={() => navigate("/transfer")}>Send money</button>
          {/* <button>Receive money</button> */}
        </div>
        <h3 className="transaction">Transactions</h3>
        <div>{state.errorMessage && <p>{state.errorMessage}</p>}</div>
        {transactions.length === 0 ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="transaction-container">
            {transactions
              .slice()
              .reverse()
              .map((item) => (
                <div key={item.id} className="card">
                  <p>{parseFloat(Number(item.amount)) > 0 ? `$${parseFloat(Number(item.amount))}` : `${parseFloat(Number(item.amount))}`}.00 </p>
                  <div className="sub-section">
                    <p className="time">{moment(item.createdAt).fromNow()}</p>
                    <p
                      className="type"
                      style={{
                        backgroundColor:
                          item.type === 'DEPOSIT' ? '#ceecff' : '#FFE0E0',
                      }}
                    >
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  </div>
}


export default Home