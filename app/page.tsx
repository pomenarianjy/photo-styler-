'use client';
import { useState } from 'react';

const STYLES = [
  { id: 'ghibli', name: 'Ghibli Style' },
  { id: 'disney', name: 'Disney Princess' },
  { id: 'onepiece', name: 'One Piece' },
  { id: 'naruto', name: 'Naruto' },
  { id: 'chow', name: 'Stephen Chow Movie' },
  { id: 'starwars', name: 'Star Wars' },
  { id: 'jurassic', name: 'Jurassic Park Mashup' },
  { id: 'kpop', name: 'Kpop Star' },
  { id: 'sports', name: 'Sports Icon' },
  { id: 'harrypotter', name: 'Harry Potter' }
];

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('ghibli');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; story: string } | null>(null);

  const lemuelSample = "https://www.caproasia.com/wp-content/uploads/2023/06/BNP-Paribas-Appoints-Lemuel-Lee-as-Head-of-Wealth-Management-Hong-Kong.jpg";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAI = async () => {
    if (!image) return;
    setLoading(false);
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image, style: selectedStyle })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.details || data.error);
      setResult(data);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#111827' }}>Multiverse Photo Styler 🌌</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
        <div style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>1. Select Image Source</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={() => setImage(lemuelSample)} style={{ display: 'block', marginTop: '8px', background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
              Load Lemuel Lee Sample Image
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>2. Pick Your Target Universe</label>
            <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
              {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <button onClick={generateAI} disabled={!image || loading} style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Processing Portal Transmit...' : 'Transform Universe Style'}
          </button>
        </div>

        <div style={{ flex: '1', minWidth: '280px', border: '2px dashed #ccc', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', minHeight: '200px' }}>
          {image ? <img src={image} alt="Source Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '6px' }} /> : <p style={{ color: '#9ca3af' }}>No source photo staging</p>}
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <h2 style={{ textAlign: 'center' }}>Portal Result</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginTop: '20px' }}>
            <img src={result.imageUrl} alt="AI Transformed" style={{ flex: '1', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
            <div style={{ flex: '1', backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>Universe Narrative Log</h3>
              <p style={{ fontStyle: 'italic', margin: 0, color: '#1e293b', lineHeight: '1.6' }}>{result.story}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}