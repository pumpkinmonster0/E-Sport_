document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           FIND SCREEN
        ===================================================== */

        const screenContent =
            document.getElementById(
                "screenContent"
            );

        if (!screenContent) {
            return;
        }


        /* =====================================================
           CREATE FOOTER
        ===================================================== */

        const footer =
            document.createElement(
                "footer"
            );

        footer.className =
            "page-footer";


        /* =====================================================
           LINE
        ===================================================== */

        const hr =
            document.createElement(
                "hr"
            );

        hr.className =
            "footer-line";


        /* =====================================================
           BADGES
        ===================================================== */

        const badges =
            document.createElement(
                "div"
            );

        badges.className =
            "footer-badges";


        /* =====================================================
           CLUB BADGE
        ===================================================== */

        const clubBadge =
            document.createElement(
                "span"
            );

        clubBadge.className =
            "badge blue";

        clubBadge.textContent =
            "UTAR E-SPORTS";


        /* =====================================================
           VERSION BADGE
        ===================================================== */

        const versionBadge =
            document.createElement(
                "span"
            );

        versionBadge.className =
            "badge green";

        versionBadge.textContent =
            "v2.0";


        /* =====================================================
           PAGE BADGE
        ===================================================== */

        const pageBadge =
            document.createElement(
                "span"
            );

        pageBadge.className =
            "badge yellow";

        pageBadge.textContent =
            "E-sports Club";


        /* =====================================================
           ADD BADGES
        ===================================================== */

        badges.appendChild(
            clubBadge
        );

        badges.appendChild(
            versionBadge
        );

        badges.appendChild(
            pageBadge
        );


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        const description =
            document.createElement(
                "p"
            );

        description.className =
            "text-muted text-small footer-text";

        description.textContent =
            "🎮 UTAR E-SPORTS CLUB • Fight for Glory!";


        /* =====================================================
           FOOTER
        ===================================================== */

        footer.appendChild(
            hr
        );

        footer.appendChild(
            badges
        );

        footer.appendChild(
            description
        );


        /* =====================================================
           ADD FOOTER TO PAGE
        ===================================================== */

        screenContent.appendChild(
            footer
        );


        console.log(
            "✅ Shared footer loaded"
        );

    }
);