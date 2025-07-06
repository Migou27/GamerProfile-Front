import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Sector
} from 'recharts';
import Loading from '../Loading/Loading';
import { useTranslation } from 'react-i18next';
import './StatsJeux.css';

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#B5FFD9",
  "#B5B2FF", "#B2FFF5", "#FFB2B2", "#B2FFB2", "#B2B2FF", "#FFB2FF"
];

const renderActiveShape = (props) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value, percent, t
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const ex = cx + (outerRadius + 30) * cos;
  const ey = cy + (outerRadius + 30) * sin;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Catégorie au centre */}
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight={700} fontSize={18}>
        {payload.console}
      </text>
      {/* Secteur principal */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Halo extérieur */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 12}
        fill={fill}
        opacity={0.3}
      />
      {/* Valeur à l'extérieur */}
      <text x={ex} y={ey} textAnchor={textAnchor} fill="#333" fontWeight={600} fontSize={16}>
        {value} {t('games')} ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

const StatsJeux = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/gamesStats');
        setStats(res.data);
      } catch (err) {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Loading message={t('Loading-Stats')} />;
  if (!stats) return <div>{t('Collection-RetrieveError')}</div>;

  // Traduction des états pour l'histogramme
  const translatedStates = stats.states
    ? stats.states.map(s => ({
        ...s,
        state: t(s.state)
      }))
    : [];

  return (
    <div className="stats-jeux">
      <h2>{t('Stats-Title')}</h2>
      <div className="stats-summary">
        <div>
          <p><strong>{t('Stats-TotalGames')} :</strong> {stats.total}</p>
          <p><strong>{t('Stats-TotalFavorites')} :</strong> {stats.favorites?.[0]?.count ?? 0}</p>
        </div>
      </div>

      <div className="charts-container">
        {/* Chart Consoles */}
        <div className="chart-section pie-chart">
          <h3>{t('Stats-RepartByConsole')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={(props) => renderActiveShape({ ...props, t })}
                data={stats.consoles}
                dataKey="count"
                nameKey="console"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {stats.consoles.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              {/* <Tooltip /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Etats */}
        <div className="chart-section states-section">
          <h3>{t('Stats-ReprtByState')}</h3>
          <div className="states-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={translatedStates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, t('Games')]}
                  labelFormatter={label => t(label)}
                />
                <Bar dataKey="count" fill="#00C49F" name={t('Games')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Chart Années */}
        <div className="chart-section">
          <h3>{t('Stats-RepartByYear')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.years}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" name={t('Games')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

export default StatsJeux;