import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import AartiCard from "./AartiCard";
import Loader from "./Loader";

const Aarti = ({ userId }) => {
  const [aartis, setAartis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchAartis = async () => {
      const { data, error } = await supabase.from("aartis").select("*");
      if (error) {
        console.error("Error fetching aartis:", error);
      } else {
        setAartis(data);
      }
      setLoading(false);
    };

    fetchAartis();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const visibleAartis = viewAll ? aartis : aartis.slice(0, 10);

  const handleViewAllClick = () => {
    setViewAll(!viewAll);
  };

  return (
    <div className="main-content-aarti">
      <div className="aartis-section">
        <div className="section-header-aarti">
          <h2 className="aarti-header">Aartis</h2>
          <button onClick={handleViewAllClick} className="view-all">
            {viewAll ? "Show Less" : "View All"}
          </button>
        </div>
        <div className="aarti-list">
          {visibleAartis.map((aarti) => (
            <AartiCard
              key={aarti.id}
              id={aarti.id}
              title={aarti.aarti}
              imageSrc={aarti.aarti_image_url}
              userId={userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Aarti;
