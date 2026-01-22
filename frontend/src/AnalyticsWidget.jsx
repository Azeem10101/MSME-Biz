import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#667eea', '#11998e', '#f5576c', '#f5af19', '#00f2fe'];

const AnalyticsWidget = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [weeklyRes, productsRes] = await Promise.all([
                    fetch('http://localhost:8000/stats/weekly'),
                    fetch('http://localhost:8000/stats/top_products')
                ]);

                const weeklyJson = await weeklyRes.json();
                const productsJson = await productsRes.json();

                setWeeklyData(weeklyJson.data || []);
                setTopProducts(productsJson.data || []);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="analytics-widget" style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-dots" style={{ justifyContent: 'center' }}>
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                </div>
                <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading analytics...</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                    <p style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{
                            color: entry.color,
                            fontSize: '0.85rem',
                            marginBottom: '4px'
                        }}>
                            {entry.name}: ₹{entry.value?.toLocaleString('en-IN') || 0}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="analytics-widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="analytics-header">
                <div className="icon">
                    <Activity size={18} color="white" />
                </div>
                <h3>Business Analytics</h3>
            </div>

            <div className="charts-grid">
                {/* Revenue Trend Chart */}
                <div>
                    <div className="chart-title">
                        <TrendingUp size={14} style={{ marginRight: '6px' }} />
                        Revenue Trend
                    </div>
                    <div className="chart-container">
                        {weeklyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f5576c" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#f5576c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                        tickFormatter={(str) => {
                                            const parts = str.split('-');
                                            return `${parts[2]}/${parts[1]}`;
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `₹${val}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        name="Sales"
                                        stroke="#667eea"
                                        strokeWidth={2}
                                        fill="url(#salesGradient)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        name="Expenses"
                                        stroke="#f5576c"
                                        strokeWidth={2}
                                        fill="url(#expensesGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem'
                            }}>
                                No data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products Pie Chart */}
                <div>
                    <div className="chart-title">
                        <PieIcon size={14} style={{ marginRight: '6px' }} />
                        Top Products
                    </div>
                    <div className="chart-container">
                        {topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topProducts}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="revenue"
                                        nameKey="product"
                                    >
                                        {topProducts.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="transparent"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem'
                            }}>
                                No sales data
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Legend */}
            {topProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginTop: '16px',
                        justifyContent: 'center'
                    }}
                >
                    {topProducts.slice(0, 5).map((product, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '3px',
                                background: COLORS[index % COLORS.length]
                            }} />
                            {product.product}
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default AnalyticsWidget;
