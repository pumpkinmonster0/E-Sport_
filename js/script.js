function showRanking(game) {

    // Hide all ranking sections
    document.getElementById("valorant-ranking").style.display = "none";
    document.getElementById("dota2-ranking").style.display = "none";
    document.getElementById("pubg-ranking").style.display = "none";
    document.getElementById("cs2-ranking").style.display = "none";
    document.getElementById("rocketleague-ranking").style.display = "none";
    document.getElementById("lol-ranking").style.display = "none";


    // Show selected ranking

    if (game === "valorant") {

        document.getElementById("valorant-ranking").style.display = "block";

    }

    else if (game === "dota2") {

        document.getElementById("dota2-ranking").style.display = "block";

    }

    else if (game === "pubg") {

        document.getElementById("pubg-ranking").style.display = "block";

    }

    else if (game === "cs2") {

        document.getElementById("cs2-ranking").style.display = "block";

    }

    else if (game === "rocketleague") {

        document.getElementById("rocketleague-ranking").style.display = "block";

    }

    else if (game === "lol") {

        document.getElementById("lol-ranking").style.display = "block";

    }

}
