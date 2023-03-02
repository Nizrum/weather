const cityName = document.querySelector(".main__city-name");
const cityInput = document.querySelector(".main__city-input");
const mainTemperature = document.querySelector(".main__temperature");
const mainIcon = document.querySelector(".main__icon");
const mainInfo = document.querySelector(".main__info");
const mainRecomendation = document.querySelector(".main__recomendation");
const manikin = document.querySelector(".manikin");
const cap = document.querySelector(".manikin__cap");
const boots = document.querySelector(".manikin__boots");
const gloves = document.querySelector(".manikin__gloves");
const hands = document.querySelector(".manikin__hands");
const hat = document.querySelector(".manikin__hat");
const head = document.querySelector(".manikin__head");
const hoodie = document.querySelector(".manikin__hoodie");
const jacket = document.querySelector(".manikin__jacket");
const pants = document.querySelector(".manikin__pants");
const scarf = document.querySelector(".manikin__scarf");
const shorts = document.querySelector(".manikin__shorts");
const sneakers = document.querySelector(".manikin__sneakers");
const tShirt = document.querySelector(".manikin__t-shirt");
const warmJacket = document.querySelector(".manikin__warm-jacket");
const underpants = document.querySelector(".manikin__underpants");

const dict = {
    шапку: hat,
    футболку: tShirt,
    шорты: shorts,
    кроссовки: sneakers,
    кепку: cap,
    кофту: hoodie,
    штаны: pants,
    "лёгкую куртку": jacket,
    "утеплённую обувь": boots,
    шарф: scarf,
    "тёплую куртку": warmJacket,
    "тёплые ботинки": boots,
    "непромокаемую обувь": boots,
    "тёплую шапку": hat,
    подштанники: underpants,
    перчатки: gloves,
};

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
    if (cityInput.value.trim() != "") {
        getData(cityInput.value);
        cityInput.blur();
        cityName.classList.remove("d-none");
        cityInput.classList.add("d-none");
    }
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
            mainIcon.classList.remove("d-none");
            mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            mainInfo.textContent = `${
                data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)
            }, ветер ${Math.round(data.wind.speed)} м/с`;
            let clothes = [];
            if (data.main.temp > 20) {
                clothes = ["футболку", "шорты", "кроссовки"];
                if (data.weather[0].main == "Clear") {
                    clothes.push("кепку");
                }
            } else if (data.main.temp > 15) {
                clothes = ["кофту", "штаны", "кроссовки"];
            } else if (data.main.temp > 10) {
                clothes = ["лёгкую куртку", "кофту", "штаны", "кроссовки"];
            } else if (data.main.temp > 5) {
                clothes = ["шапку", "лёгкую куртку", "кофту", "штаны", "утеплённую обувь"];
            } else if (data.main.temp > -10) {
                clothes = ["шапку", "шарф", "тёплую куртку", "кофту", "штаны", "тёплые ботинки"];
            } else if (data.main.temp <= -10) {
                clothes = [
                    "тёплую шапку",
                    "шарф",
                    "перчатки",
                    "тёплую куртку",
                    "кофту",
                    "штаны",
                    "подштанники",
                    "тёплые ботинки",
                ];
            }
            if (data.weather[0].main == "Rain") {
                if (clothes.includes("кроссовки")) {
                    clothes.splice(clothes.indexOf("кроссовки"), 1);
                    clothes.push("непромокаемую обувь");
                }
                clothes.push("взять зонтик");
            }
            mainRecomendation.textContent = `Рекомендуем надеть ${
                clothes.slice(0, -1).join(", ") + " и " + clothes[clothes.length - 1]
            }.`;
            if (data.main.temp <= 15) {
                clothes.splice(clothes.indexOf("кофту"), 1);
            }
            manikin.classList.remove("d-none");
            for (let elem of manikin.children) {
                elem.classList.remove("visible");
            }
            head.classList.add("visible");
            hands.classList.add("visible");
            for (let elem of clothes) {
                dict[elem].classList.add("visible");
            }
        })
        .catch(() => {
            cityName.textContent = "Город не найден, попробуйте снова";
            mainTemperature.textContent = "";
            mainIcon.classList.add("d-none");
            manikin.classList.add("d-none");
            mainInfo.textContent = "";
            mainRecomendation.textContent = "";
        });
};

localStorage.setItem("currentCity", localStorage.getItem("currentCity") || "Москва");
getData(localStorage.getItem("currentCity"));
