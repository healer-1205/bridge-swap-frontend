import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import axios from "axios"
import config from "../../config"
import { TokenContext } from "../../context/TokenContext"
import { svgIcons, Gifs } from "../../assets"
import { Benefit } from "../../components/Benefit"
import { Faq } from "../../components/Faq"
import { Support } from "../../components/Support"
import "./Home.scss"

type CurrencyInfo = {
  ticker: string
  name: string
  icon: string
  network: string
  addressRegex: string
  swapMinimum: string
}

export const Home: React.FC = () => {
  const navigate = useNavigate()

  const { sendAmount, setSendTokenAmount } = useContext(TokenContext)
  const { receiveAmount, setReceiveTokenAmount } = useContext(TokenContext)
  const { setSelectedSendToken } = useContext(TokenContext)
  const { setSelectedReceiveToken } = useContext(TokenContext)

  const [isSendOpen, setIsSendOpen] = useState(false)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)

  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [sendCurrencies, setSendCurrencies] = useState<CurrencyInfo[]>([])
  const [receiveCurrencies, setReceiveCurrencies] = useState<CurrencyInfo[]>([])
  const [selectedSendCurrency, setSelectedSendCurrency] = useState<CurrencyInfo>()
  const [selectedReceiveCurrency, setSelectedReceiveCurrency] = useState<CurrencyInfo>()

  useEffect(() => {
    axios
      .get(`${config.base_url}/api/kucoin/getCurrencies`)
      .then((res) => {
        setCurrencies(res.data)
        setSendCurrencies(res.data)
        setReceiveCurrencies(res.data)
        setSelectedSendCurrency(res.data[7])
        setSelectedReceiveCurrency(res.data[8])
      })
      .catch(console.error)
  }, [])

  const [isMinimumError, setIsMinimumError] = useState(true)
  useEffect(() => {
    if (selectedSendCurrency) {
      setSelectedSendToken(selectedSendCurrency)
      sendAmount >= +selectedSendCurrency.swapMinimum ? setIsMinimumError(false) : setIsMinimumError(true)
    }
  }, [sendAmount, selectedSendCurrency, setSelectedSendToken])

  useEffect(() => {
    if (selectedReceiveCurrency) {
      setSelectedReceiveToken(selectedReceiveCurrency)
    }
  }, [selectedReceiveCurrency, setSelectedReceiveToken])

  useEffect(() => {
    if (!isMinimumError) {
      const params = {
        from: {
          ticker: selectedSendCurrency?.ticker,
          network: selectedSendCurrency?.network,
        },
        to: {
          ticker: selectedReceiveCurrency?.ticker,
          network: selectedReceiveCurrency?.network,
        },
        amount: sendAmount.toString(),
      }

      const getData = async (params: any) => {
        const res = await axios.post("https://titanex.io/api/quoteSwap", params)
        setReceiveTokenAmount(res.data.amount)
      }

      const interval = setInterval(() => {
        getData(params)
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [isMinimumError, selectedSendCurrency, selectedReceiveCurrency, sendAmount, setReceiveTokenAmount])

  const [sendSearchInput, setSendSearchInput] = useState("")
  const [receiveSearchInput, setReceiveSearchInput] = useState("")
  useEffect(() => {
    if (currencies) {
      const result = currencies.filter((currency) => currency.ticker.includes(sendSearchInput))
      setSendCurrencies(result)
    }
  }, [sendSearchInput, currencies])
  useEffect(() => {
    if (currencies) {
      const result = currencies.filter((currency) => currency.ticker.includes(receiveSearchInput))
      setReceiveCurrencies(result)
    }
  }, [receiveSearchInput, currencies])

  const { t } = useTranslation("translation")
  return (
    <div className="home">
      <div className="home__gradient1"></div>
      <div className="home__gradient2"></div>
      <div className="home__gradient3"></div>
      <div className="home__gradient4"></div>
      <Container style={{ maxWidth: "960px" }}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <p className="home__title">{t("homepage.main-title")}</p>
          </Col>
        </Row>
      </Container>
      <Container className="swapbox_container">
        <Row>
          <Col sm={12} md={1} lg={3}>
            <img src={Gifs.Bitcoin2} alt="Bitcoin" className="home__swapImage" />
          </Col>
          <Col sm={12} md={10} lg={6}>
            <div className="swapBox">
              <Row>
                <Col>
                  <p className="text-white">{t("homepage.your-send")}</p>
                  <div className="swapBox__exchangeInput d-flex align-items-center">
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => {
                        setSendTokenAmount(+e.target.value)
                      }}
                    />
                    <div
                      className="swapBox__exchangeInput__dropdown"
                      onMouseEnter={(e) => {
                        e.preventDefault()
                        setIsSendOpen(true)
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault()
                        setIsSendOpen(false)
                      }}
                    >
                      <div className={isSendOpen ? "dropdown_content" : "dropdown_content d-none"}>
                        <div className="exchange_search">
                          <img src={svgIcons.Search} alt="Search" />
                          <input
                            type="text"
                            placeholder="Enter token name"
                            onChange={(e) => {
                              setSendSearchInput(e.target.value.toUpperCase())
                            }}
                          />
                        </div>
                        <div className="exchange_options">
                          {sendCurrencies.map((currency, index) => (
                            <div
                              className="currency_list align-items-center"
                              key={index}
                              onClick={(e) => {
                                e.preventDefault()
                                setSelectedSendCurrency(currency)
                                setIsSendOpen(false)
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <img width="41" height="41" alt="tokenImg" src={currency.icon} className="mr-10" />
                                <h6 className="mb-0">
                                  {currency.ticker} <span>{currency.network}</span>
                                </h6>
                              </div>
                              <h6 className="mb-0">{currency.name}</h6>
                            </div>
                          ))}
                        </div>
                      </div>
                      <img src={svgIcons.DownArrow} alt="DownArrow" className="downArrow" />
                      <div className="swapBox__exchangeInput__dropdown__selected">
                        <img src={selectedSendCurrency && selectedSendCurrency.icon} alt="Token" />
                        <div className="d-flex flex-column">
                          <h6>{selectedSendCurrency && selectedSendCurrency.ticker}</h6>
                          <span>{selectedSendCurrency && selectedSendCurrency.network}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isMinimumError && (
                    <span className="text-danger d-flex align-items-center">
                      <img src={svgIcons.Error} alt="Error" className="mr-10" />
                      <span>
                        Minimum{" "}
                        {selectedSendCurrency && (
                          <>
                            {selectedSendCurrency.swapMinimum}&nbsp;{selectedSendCurrency.ticker}
                          </>
                        )}
                      </span>
                    </span>
                  )}
                </Col>
                <Col lg={1} className="px-0" style={{ position: "relative" }}>
                  <img
                    src={svgIcons.Swap}
                    alt="Swap"
                    className="swapImage"
                    onClick={(e) => {
                      e.preventDefault()
                      const temp = selectedReceiveCurrency
                      setSelectedReceiveCurrency(selectedSendCurrency)
                      setSelectedSendCurrency(temp)
                    }}
                  />
                </Col>
                <Col>
                  <p className="text-white">{t("homepage.your-receive")}</p>
                  <div className="swapBox__exchangeInput d-flex align-items-center">
                    <input type="number" value={receiveAmount} readOnly />
                    <div
                      className="swapBox__exchangeInput__dropdown"
                      onMouseEnter={(e) => {
                        e.preventDefault()
                        setIsReceiveOpen(true)
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault()
                        setIsReceiveOpen(false)
                      }}
                    >
                      <div className={isReceiveOpen ? "dropdown_content" : "dropdown_content d-none"}>
                        <div className="exchange_search">
                          <img src={svgIcons.Search} alt="Search" />
                          <input
                            type="text"
                            placeholder="Enter token name"
                            onChange={(e) => {
                              setReceiveSearchInput(e.target.value.toUpperCase())
                            }}
                          />
                        </div>
                        <div className="exchange_options">
                          {receiveCurrencies.map((currency, index) => (
                            <div
                              className="currency_list align-items-center"
                              key={index}
                              onClick={(e) => {
                                e.preventDefault()
                                setSelectedReceiveCurrency(currency)
                                setIsReceiveOpen(false)
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <img width="41" height="41" alt="tokenImg" src={currency.icon} className="mr-10" />
                                <h6 className="mb-0">
                                  {currency.ticker} <span>{currency.network}</span>
                                </h6>
                              </div>
                              <h6 className="mb-0">{currency.name}</h6>
                            </div>
                          ))}
                        </div>
                      </div>
                      <img src={svgIcons.DownArrow} alt="DownArrow" className="downArrow" />
                      <div className="swapBox__exchangeInput__dropdown__selected">
                        <img src={selectedReceiveCurrency && selectedReceiveCurrency.icon} alt="Token" />
                        <div className="d-flex flex-column">
                          <h6>{selectedReceiveCurrency && selectedReceiveCurrency.ticker}</h6>
                          <span>{selectedReceiveCurrency && selectedReceiveCurrency.network}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={0} md={2} lg={3}></Col>
                <Col sm={12} md={8} lg={6}>
                  <button
                    className="custom_button mt-20"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate("/swap")
                    }}
                  >
                    {t("homepage.swap-now")}
                  </button>
                </Col>
                <Col sm={0} md={2} lg={3}></Col>
              </Row>
            </div>
          </Col>
          <Col sm={12} md={1} lg={3}>
            <img src={Gifs.BNB} alt="Bitcoin" className="home__swapImage" />
          </Col>
        </Row>
      </Container>
      <Benefit />
      <Faq />
      <Support />
    </div>
  )
}
