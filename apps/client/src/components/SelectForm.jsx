import Select from 'react-select'



const options = [
  { value: 'withdraw', label: 'Withdraw' },
  { value: 'deposit', label: 'Deposit' },
]

const SelectForm = ({ state, handleSubmit, handleChange, handleAmountChange }) => {
  return <form onSubmit={handleSubmit}>
    <div>
      <label>Transaction type</label>
      <Select
        options={options}
        name="selectedOption"
        placeholder="Select"
        value={state.selectedOption}
        onChange={handleChange}
        styles={{
          control: (provided, state) => ({
            ...provided,
            width: '170px',
          }),
        }}
      />
    </div>
    <div>
      <label style={{ marginLeft: '-95px' }}>Amount</label>
      <div>
        <input
          value={state.amount}
          name="amount"
          onChange={handleAmountChange}
          type="number"
        />
      </div>
    </div>
    <button>Add Transaction</button>
  </form>
}

export default SelectForm