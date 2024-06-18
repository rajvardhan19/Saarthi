import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import AartiCard from "./AartiCard";

const Aarti = ({ userId, selectedLanguage }) => {
  const [aartis, setAartis] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchAartis = async () => {
      let tableName;
      switch (selectedLanguage) {
        case "hindi":
          tableName = "hindi_aartis";
          break;
        case "marathi":
          tableName = "marathi_aartis";
          break;
        default:
          tableName = "aartis";
      }

      const { data, error } = await supabase.from(tableName).select("*");
      if (error) {
        console.error("Error fetching aartis:", error);
      } else {
        setAartis(data);
      }
    };

    fetchAartis();
  }, [selectedLanguage]);

  const visibleAartis = viewAll ? aartis : aartis.slice(0, 6);

  return (
    <div className="main-content-aarti">
      <div className="aartis-section">
        <div className="section-header-aarti">
          <h2 className="aarti-header">Aartis</h2>
          <button onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show Less" : "View All"}
          </button>
        </div>
        <div className="aarti-list">
          {visibleAartis.length === 0 ? (
            <p>No aartis found</p>
          ) : (
            visibleAartis.map((aarti) => (
              <AartiCard
                key={aarti.id}
                id={aarti.id}
                title={aarti.aarti}
                imageSrc={aarti.aarti_image_url}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Aarti;
