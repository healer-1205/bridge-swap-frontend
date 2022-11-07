import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Tokens, svgIcons, Gifs } from "../../assets"
import "./Home.scss"

export const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home__gradient1"></div>
      <div className="home__gradient2"></div>
      <div className="home__gradient3"></div>
      <div className="home__gradient4"></div>
      <Container style={{ maxWidth: "960px" }}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <p className="home__title">Swap your favorite CTYPTO without KYC</p>
          </Col>
        </Row>
      </Container>
      <Container>
        <span className="home__description">Fixed rate 0.1%.</span>
      </Container>
      <Container>
        <Row>
          <Col sm={12} md={3} lg={3}>
            <img src={Gifs.Bitcoin2} alt="Bitcoin" className="home__swapImage" />
          </Col>
          <Col sm={12} md={6} lg={6}>
            <div className="swapBox">
              <Row>
                <Col>
                  <p className="text-white">Your Send</p>
                  <div className="swapBox__exchangeInput d-flex align-items-center">
                    <input type="number" placeholder="0" />
                    <div className="swapBox__exchangeInput__dropdown">
                      <img src={svgIcons.DownArrow} alt="DownArrow" className="downArrow" />
                      <div className="swapBox__exchangeInput__dropdown__selected">
                        <img src={Tokens.BTC} alt="BTC" />
                        <div className="d-flex flex-column">
                          <h6>BTC</h6>
                          <span>BTC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={1} className="px-0" style={{ position: "relative" }}>
                  <img src={svgIcons.Swap} alt="Swap" className="swapImage" />
                </Col>
                <Col>
                  <p className="text-white">Your receive</p>
                  <div className="swapBox__exchangeInput d-flex align-items-center">
                    <input type="number" placeholder="0" />
                    <div className="swapBox__exchangeInput__dropdown">
                      <img src={svgIcons.DownArrow} alt="DownArrow" className="downArrow" />
                      <div className="swapBox__exchangeInput__dropdown__selected">
                        <img src={Tokens.ETH} alt="BTC" />
                        <div className="d-flex flex-column">
                          <h6>ETH</h6>
                          <span>ERC20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <input type="text" placeholder="Enter your wallet address" className="addressInput mt-20" />
                </Col>
              </Row>
              <Row>
                <Col></Col>
                <Col>
                  <button className="custom_button mt-20">Swap Now</button>
                </Col>
                <Col></Col>
              </Row>
            </div>
          </Col>
          <Col sm={12} md={3} lg={3}>
            <img src={Gifs.BNB} alt="Bitcoin" className="home__swapImage" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
