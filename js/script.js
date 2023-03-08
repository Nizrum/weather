const cityName = document.querySelector(".main__city-name"),
    cityInput = document.querySelector(".main__city-input"),
    cityEditButton = document.querySelector(".main__city-edit-button"),
    mainTemperature = document.querySelector(".main__temperature"),
    mainIcon = document.querySelector(".main__icon"),
    mainInfo = document.querySelector(".main__info"),
    mainRecomendation = document.querySelector(".main__recomendation"),
    manikin = document.querySelector(".manikin"),
    cap = document.querySelector(".manikin__cap"),
    boots = document.querySelector(".manikin__boots"),
    gloves = document.querySelector(".manikin__gloves"),
    hands = document.querySelector(".manikin__hands"),
    hat = document.querySelector(".manikin__hat"),
    head = document.querySelector(".manikin__head"),
    hoodie = document.querySelector(".manikin__hoodie"),
    jacket = document.querySelector(".manikin__jacket"),
    pants = document.querySelector(".manikin__pants"),
    scarf = document.querySelector(".manikin__scarf"),
    shorts = document.querySelector(".manikin__shorts"),
    sneakers = document.querySelector(".manikin__sneakers"),
    tShirt = document.querySelector(".manikin__t-shirt"),
    warmJacket = document.querySelector(".manikin__warm-jacket"),
    underpants = document.querySelector(".manikin__underpants");

const dict = {
    шапку: hat,
    футболку: tShirt,
    шорты: shorts,
    кроссовки: sneakers,
    кепку: cap,
    кофту: hoodie,
    штаны: pants,
    ветровку: jacket,
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

const cityChangeHandler = () => {
    if (cityInput.value.trim() != "") {
        getData(cityInput.value);
        cityInput.blur();
        cityName.classList.remove("d-none");
        cityEditButton.classList.remove("d-none");
        cityInput.classList.add("d-none");
    }
};

const cityEditHandler = () => {
    cityName.classList.add("d-none");
    cityEditButton.classList.add("d-none");
    cityInput.classList.remove("d-none");
    cityInput.focus();
};

const getClothes = (data) => {
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
    if (data.main.temp > 15 && data.wind.speed >= 10) {
        clothes.push("ветровку");
    }
    if (data.weather[0].main == "Rain") {
        if (clothes.includes("кроссовки")) {
            clothes.splice(clothes.indexOf("кроссовки"), 1);
            clothes.push("непромокаемую обувь");
        }
        clothes.push("взять зонтик");
    }

    return clothes;
};

const showClothes = (clothes) => {
    manikin.classList.remove("d-none");
    for (let elem of manikin.children) {
        elem.classList.remove("visible");
    }
    head.classList.add("visible");
    hands.classList.add("visible");
    for (let elem of clothes) {
        dict[elem].classList.add("visible");
    }
};

const renderData = (data) => {
    let clothes = getClothes(data);

    cityName.textContent = data.name;
    mainTemperature.textContent = Math.round(data.main.temp) + "°";
    mainIcon.classList.remove("d-none");
    mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    mainInfo.textContent = `${
        data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)
    }, ветер ${Math.round(data.wind.speed)} м/с`;
    mainRecomendation.textContent = `Рекомендуем надеть ${
        clothes.slice(0, -1).join(", ") + " и " + clothes[clothes.length - 1]
    }.`;
    if (data.main.temp <= 15) {
        clothes.splice(clothes.indexOf("кофту"), 1);
    }
    if (clothes.includes("ветровку") && clothes.includes("футболку")) {
        clothes.splice(clothes.indexOf("футболку"), 1);
    }
    if (clothes.includes("ветровку") && clothes.includes("кофту")) {
        clothes.splice(clothes.indexOf("кофту"), 1);
    }

    showClothes(clothes);
};

const renderCityNotFound = () => {
    cityName.textContent = "Город не найден, попробуйте снова";
    mainTemperature.textContent = "";
    mainInfo.textContent = "";
    mainRecomendation.textContent = "";
    mainIcon.classList.add("d-none");
    manikin.classList.add("d-none");
};

const getData = (city) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=11233bdd6a0945b64d98ba77ab4b55a7&units=metric&lang=ru`
    )
        .then((response) => response.text())
        .then((data) => JSON.parse(data))
        .then((data) => {
            localStorage.setItem("currentCity", data.name);
            renderData(data);
        })
        .catch(() => {
            renderCityNotFound();
        });
};

cityName.addEventListener("click", () => {
    cityEditHandler();
});

cityEditButton.addEventListener("click", () => {
    cityEditHandler();
});

cityInput.addEventListener("blur", () => {
    cityChangeHandler();
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        cityChangeHandler();
    }
});

localStorage.setItem("currentCity", localStorage.getItem("currentCity") || "Москва");
getData(localStorage.getItem("currentCity"));
