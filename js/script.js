const cityName = document.querySelector(".main__city-name");
const cityInput = document.querySelector(".main__city-input");
const mainTemperature = document.querySelector(".main__temperature");
const mainInfo = document.querySelector(".main__info");
const mainRecomendation = document.querySelector(".main__recomendation");

cityName.addEventListener("click", () => {
    cityName.classList.add("d-none");
    cityInput.classList.remove("d-none");
    cityInput.focus();
});

cityInput.addEventListener("blur", (event) => {
    changeCity();
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        changeCity();
    }
});

const changeCity = () => {
    getData(cityInput.value);
    cityInput.blur();
    cityName.classList.remove("d-none");
    cityInput.classList.add("d-none");
};

const getData = (city) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=11233bdd6a0945b64d98ba77ab4b55a7&units=metric&lang=ru`
    )
        .then((response) => response.text())
        .then((data) => JSON.parse(data))
        .then((data) => {
            localStorage.setItem("currentCity", data.name);
            cityName.textContent = data.name;
            mainTemperature.textContent = Math.round(data.main.temp) + "°";
            mainInfo.textContent = `${data.weather[0].description}, ветер ${Math.round(data.wind.speed)} м/с`;
            mainRecomendation.textContent = 'Рекомендуем надеть куртку, шапку, ботинки и взять с собой зонтик.';
        })
        .catch(() => {
            cityName.textContent = "Город не найден, попробуйте снова";
            mainTemperature.textContent = "";
            mainInfo.textContent = "";
            mainRecomendation.textContent = "";
        });
};

localStorage.setItem("currentCity", localStorage.getItem("currentCity") || "Москва");
getData(localStorage.getItem("currentCity"));
