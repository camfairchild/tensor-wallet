import {
  FunctionComponent,
  useState,
  ChangeEvent,
  MouseEvent,
  SetStateAction,
  Dispatch,
} from "react"
import Box from "@mui/material/Box"
import { BN } from "@polkadot/util"
import CurrencyInput from 'react-currency-input-field';

interface Props {
  total: BN
  currency: string
  setAmount: Dispatch<SetStateAction<string>>
}

const InputFunds: FunctionComponent<Props> = ({
  total,
  setAmount,
  currency
}: Props) => {
  

  const handleChange = (value: any) => {
    if (value === "" || value === undefined) {
      setAmount("0")
      return
    }
    let v = parseFloat(value)
    v = v * 1e9 // convert to rao
    setAmount(Math.trunc(v).toString())
  }

  // @TODO focus/blur TextField and %Buttons at the same time in a React way
  const [focus, setFocus] = useState<boolean>(false)
  const handleFocus = () => {
    setFocus(!focus)
  }

  return (
    <>
      <Box marginBottom={1}>
        <CurrencyInput
          style={styles.input}
          id="SendFundsAmountField"
          name="input-name"
          placeholder="0"
          defaultValue={0.0}
          decimalsLimit={9}
          onValueChange={(value, name) => handleChange(value)}
          allowNegativeValue={false}
          suffix={` ${currency}`}
          step={1e-9}
        />
      </Box>
    </>
  )
}

const styles = {
  input: {
    width: "100%",
    height: "55px",
    fontSize: "24px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
}

export default InputFunds
