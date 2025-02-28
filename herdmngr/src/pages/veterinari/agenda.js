import React from "react";
import Header from "../../components/header";

const AgendaVeterinari = () => {
  return (
    <div className="flex flex-col items-center">
      <Header showBack={true} />
      <h2 className="text-xl my-4">La tua Agenda</h2>

      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <iframe
          title="Google Calendar"
          src="https://calendar.google.com/calendar/embed?src=8e30e8f315a8f83ade110718c425f1767c2a432dbf222574eb134ce2f6b231be%40group.calendar.google.com&ctz=Europe/Rome"
          style={{
            width: "80%",
            maxWidth: "900px",
            height: "600px",
            border: "none",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AgendaVeterinari;
