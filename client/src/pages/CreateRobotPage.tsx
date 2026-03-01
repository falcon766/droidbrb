import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreateRobotForm } from '../types';
import { robotService } from '../services/robotService';
import { distanceService } from '../services/distanceService';
import { searchService } from '../services/searchService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C } from '../design';
import toast from 'react-hot-toast';

const CreateRobotPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<CreateRobotForm>();

  const categories = ['Educational', 'Industrial', 'Service', 'Hobby', 'Humanoid', 'Drone', 'Medical', 'Other'];

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) { toast.error(`"${file.name}" is not an image file`); return false; }
      if (file.size > 10 * 1024 * 1024) { toast.error(`"${file.name}" exceeds 10MB limit`); return false; }
      return true;
    });
    if (images.length + validFiles.length > 10) { toast.error('Maximum 10 images allowed'); return; }
    setImages([...images, ...validFiles]);
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handleLocationChange = async (value: string) => {
    setLocationValue(value);
    setSelectedLocation('');
    if (value.length >= 3) {
      try {
        const suggestions = await searchService.getLocationSuggestions(value);
        setLocationSuggestions(suggestions);
        setShowLocationSuggestions(true);
      } catch { setLocationSuggestions([]); setShowLocationSuggestions(false); }
    } else { setLocationSuggestions([]); setShowLocationSuggestions(false); }
  };

  const handleLocationSelect = (suggestion: any) => {
    const locationText = suggestion.description;
    const hasStateOrCountry = locationText.includes(',');
    if (!hasStateOrCountry) { toast.error('Please select a more specific location'); return; }
    setLocationValue(locationText);
    setSelectedLocation(locationText);
    setShowLocationSuggestions(false);
    toast.success(`Location selected: ${locationText}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') e.preventDefault(); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.location-input-container')) setShowLocationSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = async (data: CreateRobotForm) => {
    if (!currentUser) { toast.error('You must be logged in'); return; }
    if (!selectedLocation) { toast.error('Please select a location from suggestions'); return; }
    setIsLoading(true);
    try {
      let latitude: number | undefined, longitude: number | undefined;
      const coordinates = await distanceService.getCoordinatesFromAddress(selectedLocation);
      if (coordinates) { latitude = coordinates.latitude; longitude = coordinates.longitude; }
      else { toast.error('Could not determine GPS coordinates. Try a more specific location.'); setIsLoading(false); return; }

      const robotData = {
        ...data, location: selectedLocation, features, latitude, longitude,
        specifications: { weight: data.specifications?.weight || '', dimensions: data.specifications?.dimensions || '', batteryLife: data.specifications?.batteryLife || '', connectivity: data.specifications?.connectivity || '' },
      };
      await robotService.createRobot(robotData, currentUser.uid, images);
      toast.success('Robot listing created!');
      navigate('/dashboard');
    } catch (error: any) { toast.error(error.message || 'Failed to create listing'); }
    finally { setIsLoading(false); }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: C.pureWhite,
    border: `1.5px solid ${C.gray200}`, borderRadius: 10,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.black, outline: "none", transition: "border 0.3s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8,
  };

  const errorStyle: React.CSSProperties = { fontSize: 13, color: "#ef4444", marginTop: 4 };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", color: C.black }}>
      <Navbar />

      <section style={{ background: C.white, padding: "100px 48px 40px", borderBottom: `1px solid ${C.gray100}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray400, marginBottom: 24 }}>New Listing</div>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.15 }}>List your robot.</h1>
        </div>
      </section>

      <section style={{ background: C.gray50, padding: "48px 48px 100px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Basic Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Robot Name *</label>
                  <input {...register('name', { required: 'Robot name is required' })} placeholder="e.g., Loona Pet Robot" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select {...register('category', { required: 'Category is required' })} style={{ ...inp, cursor: "pointer" }}>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p style={errorStyle}>{errors.category.message}</p>}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea {...register('description', { required: 'Description is required' })} rows={4} placeholder="Describe your robot..."
                    style={{ ...inp, borderRadius: 10, resize: "vertical" }}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
                </div>
              </div>
            </div>

            {/* Pricing & Location */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Pricing & Location</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Daily Rate ($) *</label>
                  <input type="number" {...register('price', { required: 'Price is required', min: { value: 1, message: 'Min $1' } })} placeholder="25" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
                </div>
                <div className="location-input-container" style={{ position: "relative" }}>
                  <label style={labelStyle}>Location *</label>
                  <input type="text" value={locationValue} onChange={e => handleLocationChange(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Start typing city, state..." style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", zIndex: 50, maxHeight: 240, overflowY: "auto" }}>
                      {locationSuggestions.map((s: any, i: number) => (
                        <button key={i} type="button" onClick={() => handleLocationSelect(s)}
                          style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", borderBottom: `1px solid ${C.gray100}`, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.black }}>{s.structured_formatting.main_text}</div>
                          <div style={{ fontSize: 13, color: C.gray400 }}>{s.structured_formatting.secondary_text}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedLocation && <p style={{ fontSize: 13, color: C.blue, marginTop: 4 }}>Location selected: {selectedLocation}</p>}
                  {!selectedLocation && locationValue && <p style={{ fontSize: 13, color: C.gray400, marginTop: 4 }}>Select a location from suggestions</p>}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Availability</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Min Rental (days)</label>
                  <input type="number" {...register('minRental', { min: 1 })} placeholder="1" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Max Rental (days)</label>
                  <input type="number" {...register('maxRental', { min: 1 })} placeholder="30" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Pickup Time</label>
                  <input type="text" {...register('pickupTime')} placeholder="9:00 AM - 6:00 PM" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Return Time</label>
                  <input type="text" {...register('returnTime')} placeholder="9:00 AM - 6:00 PM" style={inp} />
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Features</h2>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="Add a feature (e.g., Voice Recognition)" style={{ ...inp, flex: 1 }} />
                <button type="button" onClick={addFeature}
                  style={{ padding: "12px 16px", borderRadius: 10, background: C.blue, color: C.pureWhite, border: "none", cursor: "pointer", transition: "all 0.25s" }}>
                  <Plus size={18} />
                </button>
              </div>
              {features.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {features.map((f, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, border: `1px solid ${C.gray200}`, fontSize: 13, fontWeight: 500, color: C.gray500 }}>
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gray400, padding: 0, lineHeight: 1 }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Images</h2>
              <div style={{ border: `2px dashed ${C.gray200}`, borderRadius: 12, padding: "40px 20px", textAlign: "center" }}>
                <Upload size={32} color={C.gray300} style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: 15, color: C.gray500, marginBottom: 4 }}>Upload robot images</p>
                <p style={{ fontSize: 13, color: C.gray400, marginBottom: 16 }}>PNG, JPG up to 10MB each</p>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload"
                  style={{ padding: "10px 24px", borderRadius: 100, background: C.blue, color: C.pureWhite, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  Choose Files
                </label>
              </div>
              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
                  {images.map((image, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={URL.createObjectURL(image)} alt={`Robot ${i + 1}`} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.gray100}` }} />
                      <button type="button" onClick={() => removeImage(i)}
                        style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", color: C.pureWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28, marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>Specifications</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Weight</label>
                  <input type="text" {...register('specifications.weight')} placeholder="e.g., 5 lbs" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Dimensions</label>
                  <input type="text" {...register('specifications.dimensions')} placeholder="e.g., 12x8x6 in" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Battery Life</label>
                  <input type="text" {...register('specifications.batteryLife')} placeholder="e.g., 4 hours" style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>Connectivity</label>
                  <input type="text" {...register('specifications.connectivity')} placeholder="e.g., WiFi, Bluetooth" style={inp} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={isLoading}
                style={{
                  padding: "14px 36px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                  background: isLoading ? C.gray300 : C.blue, color: C.pureWhite,
                  border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all 0.25s",
                }}>
                {isLoading ? 'Creating...' : 'List Robot'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateRobotPage;
