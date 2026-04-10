  const getStars = (num) => {
        let estrellas = "";

        for (let i = 0; i < 5; i++){
            estrellas += i < num ? "★" : "☆";
        }

        return estrellas;
    }

    module.exports = getStars;