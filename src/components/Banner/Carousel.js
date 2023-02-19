import { makeStyles } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import axios from "axios";
import { TrendingCoins } from "../../config/api";
import AliceCarousel from "react-alice-carousel";

import { CryptoState } from "../../CryptoContext";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  Carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  CarouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const classes = useStyles();
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = () => {
    axios.get(TrendingCoins(currency)).then((res) => {
      setTrending(res.data);
    });
  };
  // console.log("trending on crousal", trending);
  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link to={`/coins/${coin.id}`} className={classes.CarouselItem}>
        <img
          src={coin.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        ></img>
        <span>
          {coin.symbol}
          &nbsp;
          <span style={{ color: profit > 0 ? "rgb(14,203,129)" : "red" }}>
            {profit && "+"}
            {coin.price_change_percentage_24h.toFixed(2)}
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol}
          {numberWithCommas(coin.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.Carousel}>
      {" "}
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        items={items}
        responsive={responsive}
        autoPlay
        disableDotsControls
        disableButtonsControls
      />
    </div>
  );
};

export default Carousel;
