import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const AnalyticsWidget = () => {
    const [data, setData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        // Fetch Weekly Stats
        Promise.all([
            fetch('http://localhost:8000/stats/weekly')
                .then(res => res.json())
                .then(d => setData(d.data)),
            fetch('http://localhost:8000/stats/top_products')
                .then(res => res.json())
                .then(d => setTopProducts(d.data))
        ])
            .catch(err => console.error("Failed to load stats", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Loading skeleton
    if (isLoading) {
        return (
            <div style={{
                background: 'var(--white)',
                border: 'var(--border-thick)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px',
                boxShadow: 'var(--shadow-brutal)',
                color: 'var(--black)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{
                        background: '#facc15',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'var(--border-thin)'
                    }}>
                        <TrendingUp size={20} color="var(--black)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Loading Analytics...</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {[1, 2].map(i => (
                        <div key={i} style={{
                            height: '200px',
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            borderRadius: '8px',
                            border: 'var(--border-thin)'
                        }} />
                    ))}
                </div>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                `}</style>
            </div>
        );
    }

    if (data.length === 0) return null;

    return (
        <div style={{
            background: 'var(--white)',
            border: 'var(--border-thick)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: 'var(--shadow-brutal)',
            color: 'var(--black)',
            minWidth: '500px',
            width: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                    background: '#facc15',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'var(--border-thin)'
                }}>
                    <TrendingUp size={20} color="var(--black)" />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Weekly Trends</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ height: '200px', width: '100%' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700' }}>REVENUE TREND</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: 'var(--black)' }}
                                tickFormatter={(str) => {
                                    const [y, m, d] = str.split('-');
                                    return `${d}/${m}`;
                                }}
                            />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--black)' }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--white)',
                                    border: 'var(--border-thin)',
                                    borderRadius: '8px',
                                    boxShadow: 'var(--shadow-brutal)',
                                    color: 'var(--black)'
                                }}
                                itemStyle={{ color: 'var(--black)' }}
                            />
                            <Bar dataKey="sales" name="Sales" fill="#3b82f6" stroke="var(--black)" strokeWidth={2} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Exp" fill="#ef4444" stroke="var(--black)" strokeWidth={2} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ height: '200px', width: '100%' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700' }}>TOP PRODUCTS</h4>
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topProducts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                    nameKey="product"
                                    stroke="var(--black)"
                                    strokeWidth={2}
                                >
                                    {topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--white)',
                                        border: 'var(--border-thin)',
                                        borderRadius: '8px',
                                        boxShadow: 'var(--shadow-brutal)',
                                        color: 'var(--black)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>No Sales Data</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsWidget;
