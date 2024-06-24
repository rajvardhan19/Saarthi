import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import AartiCard from "./AartiCard";

const Aarti = ({ userId }) => {
  const [aartis, setAartis] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchAartis = async () => {
      const { data, error } = await supabase.from("aartis").select("*");
      if (error) {
        console.error("Error fetching aartis:", error);
      } else {
        setAartis(data);
      }
    };

    fetchAartis();
  }, []);

  const visibleAartis = viewAll ? aartis : aartis.slice(0, 10);

  return (
    <div className="main-content-aarti">
      <div className="aartis-section">
        <div className="section-header-aarti">
          <h2>Aartis</h2>
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
