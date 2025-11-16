import * as React from "react";
const { useEffect, useRef, useState } = React;

export default function GoogleTranslate(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // Initialise la fonction callback attendue par le script Google
  useEffect(() => {
    (window as any).googleTranslateElementInit = function googleTranslateElementInit() {
      try {
        // Si l'élément existe, crée le widget (Google l'ignore si déjà présent)
        if (document.getElementById("google_translate_element")) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "fr",
              includedLanguages: "en,it,es,de,ar",
              layout:
                (window as any).google?.translate?.TranslateElement?.InlineLayout?.SIMPLE ?? 0,
            },
            "google_translate_element"
          );
        }
      } catch (e) {
        // silencieux mais log utile pour debug
        // console.warn("GT init failed:", e);
      }
    };

    // Injecte le script si besoin
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // cleanup
    return () => {
      try {
        delete (window as any).googleTranslateElementInit;
      } catch {
        (window as any).googleTranslateElementInit = undefined;
      }
    };
  }, []);

  // Quand on ouvre le menu, s'assurer que le widget est bien initialisé
  const ensureWidget = () => {
    // si google est dispo et que le <select> n'existe pas encore, (ré)initialiser
    try {
      const hasSelect =
        !!document.querySelector("#google_translate_element select");

      if ((window as any).google && !(window as any).google.translate) {
        // parfois l'objet google existe mais translate pas encore : on attend
        // on laisse l'init callback gérer la création
      }

      if ((window as any).google && (window as any).google.translate && !hasSelect) {
        // ré-appel pour forcer la création si nécessaire
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "fr",
            includedLanguages: "en,it,es,de,ar",
            layout:
              (window as any).google?.translate?.TranslateElement?.InlineLayout?.SIMPLE ?? 0,
          },
          "google_translate_element"
        );
      }
    } catch (e) {
      // ignore
    }
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      // ouverture -> s'assurer widget
      // petit délai pour laisser le DOM se stabiliser s'il y a des animations
      window.setTimeout(ensureWidget, 100);
    }
  };

  // Styles inline pour l'exemple — tu peux les mettre dans un CSS/SCSS séparé
  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <button
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls="google_translate_menu"
        title="Traduire la page"
        style={{
          background: "linear-gradient(135deg,#5b6cff 0%,#9a8bff 100%)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 52,
          height: 52,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        🌐
      </button>

      {/* Wrapper visuel (toggle) */}
      <div
        id="google_translate_menu"
        style={{
          marginTop: 10,
          width: 200,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(10,20,40,0.12)",
          overflow: "hidden",
          transition: "transform 0.22s ease, opacity 0.22s ease",
          transform: open ? "translateY(0)" : "translateY(8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          background: "white",
        }}
      >
        {/* IMPORTANT : cet élément est TOUJOURS rendu pour permettre à Google d'injecter la liste */}
        <div
          id="google_translate_element"
          ref={rootRef}
          style={{
            padding: 10,
            // Le contenu Google (select) aura son propre rendu ; on peut styliser le select ci-dessous via CSS global si besoin.
          }}
        />

        {/* style local pour rendre le select plus propre (si tu utilises CSS global, préfère un fichier CSS) */}
        <style>
          {`
            /* règle pour styliser le select Google Translate */
            #google_translate_element select {
              width: 100%;
              padding: 8px 10px;
              border-radius: 8px;
              border: 1px solid rgba(0,0,0,0.08);
              font-size: 14px;
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: linear-gradient(45deg, transparent 50%, transparent 50%),
                linear-gradient(135deg, transparent 50%, transparent 50%); /* keep neutral */
            }

            /* cache le label "Select language" (si Google l'ajoute) et ne laisse que le select */
            #google_translate_element .goog-te-banner-frame.skiptranslate { display: none !important; }
            .goog-te-gadget-icon { display: none !important; }
          `}
        </style>
      </div>
    </div>
  );
}
  