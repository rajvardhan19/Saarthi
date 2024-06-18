import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import AartiCard from "./AartiCard";

const Aarti = ({ userId, selectedLanguage }) => {
  const [aartis, setAartis] = useState([]);
  const [allAartis, setAllAartis] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchHindiAartis = async () => {
      const { data, error } = await supabase.from("hindi_aartis").select("*");
      if (error) {
        console.error("Error fetching hindi aartis:", error);
      } else {
        setAartis(data);
      }
    };

    fetchHindiAartis();
  }, []);

  useEffect(() => {
    if (viewAll) {
      const fetchAllAartis = async () => {
        const hindiAartis = await supabase.from("hindi_aartis").select("*");
        const marathiAartis = await supabase.from("marathi_aartis").select("*");
        const englishAartis = await supabase.from("aartis").select("*");

        if (hindiAartis.error || marathiAartis.error || englishAartis.error) {
          console.error(
            "Error fetching aartis:",
            hindiAartis.error,
            marathiAartis.error,
            englishAartis.error
          );
          return;
        }

        const combinedAartis = [
          ...hindiAartis.data,
          ...marathiAartis.data,
          ...englishAartis.data,
        ];

        setAllAartis(combinedAartis);
        setAartis(combinedAartis);
      };

      fetchAllAartis();
    } else {
      const fetchHindiAartis = async () => {
        const { data, error } = await supabase.from("hindi_aartis").select("*");
        if (error) {
          console.error("Error fetching hindi aartis:", error);
        } else {
          setAartis(data);
        }
      };

      fetchHindiAartis();
    }
  }, [viewAll]);

  const handleViewAll = () => {
    setViewAll(!viewAll);
  };

  const visibleAartis = viewAll ? aartis : aartis.slice(0, 10);

  return (
    <div className="main-content-aarti">
      <div className="aartis-section">
        <div className="section-header-aarti">
          <h2 className="aarti-header">Aartis</h2>
          <button onClick={handleViewAll}>
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
