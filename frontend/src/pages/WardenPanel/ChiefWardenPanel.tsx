import "./ChiefWardenPanel.css";
import Header from "../../components/ChiefWarden/Header/Header";
import StatCard from "../../components/ChiefWarden/StatCard/StatCard";
import CostTrends from "../../components/ChiefWarden/CostTrends/CostTrends";
import Alerts from "../../components/ChiefWarden/Alerts/Alerts";
import RankingTable from "../../components/ChiefWarden/RankingTable/RankingTable";

const ChiefWardenPanel = () => {
  return (
    <div className="chief-container">
      <Header />

      <div className="stats">
        <StatCard title="Total Footfall" value="12,482" change="+4.2%" />
        <StatCard title="Avg Cost/Plate" value="$4.12" change="-2.1%" />
        <StatCard title="Avg Rating" value="4.2" change="4.8/5" />
        <StatCard title="Waste Index" value="12%" change="Weekly" />
      </div>

      <div className="middle-section">
        <CostTrends />
        <Alerts />
      </div>

      <RankingTable />
    </div>
  );
};

export default ChiefWardenPanel;