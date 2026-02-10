import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin, Navigation, Search, Locate } from "lucide-react";
import { toast } from "sonner";

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
    onLocationSelect: (data: {
        latitude: number;
        longitude: number;
        formattedAddress: string;
    }) => void;
    initialPosition?: { latitude: number; longitude: number };
}

// Component to recenter map when position changes
function MapController({ position }: { position: L.LatLng | null }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 1 });
        }
    }, [position, map]);

    return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: any) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export const LocationPicker = ({ onLocationSelect, initialPosition }: LocationPickerProps) => {
    const defaultCenter = {
        lat: initialPosition?.latitude || 22.5, // India center
        lng: initialPosition?.longitude || 78.9,
    };

    const [position, setPosition] = useState<L.LatLng | null>(
        initialPosition
            ? L.latLng(initialPosition.latitude, initialPosition.longitude)
            : null
    );
    const [formattedAddress, setFormattedAddress] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Reverse geocoding to get address from coordinates
    const getAddressFromCoordinates = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch (error) {
            console.error("Error getting address:", error);
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    // Forward geocoding to get coordinates from address
    const searchLocation = async (query?: string) => {
        const searchText = query || searchQuery;
        if (!searchText.trim()) {
            toast.error("Please enter a location to search");
            return;
        }

        setIsSearching(true);
        setShowSuggestions(false);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchText
                )}&countrycodes=in&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPosition = L.latLng(parseFloat(lat), parseFloat(lon));
                setPosition(newPosition);
                setSearchQuery(searchText);
                toast.success("Location found!");
            } else {
                toast.error("Location not found. Please try a different search.");
            }
        } catch (error) {
            toast.error("Failed to search location");
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Autocomplete search suggestions
    const handleSearchInput = async (value: string) => {
        setSearchQuery(value);

        if (value.trim().length < 3) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    value
                )}&countrycodes=in&limit=5`
            );
            const data = await response.json();
            setSearchSuggestions(data);
            setShowSuggestions(data.length > 0);
        } catch (error) {
            console.error("Autocomplete error:", error);
        }
    };

    // Select a suggestion
    const selectSuggestion = (suggestion: any) => {
        const newPosition = L.latLng(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
        setPosition(newPosition);
        setSearchQuery(suggestion.display_name);
        setShowSuggestions(false);
        setSearchSuggestions([]);
        toast.success("Location selected!");
    };

    // Get current location using browser geolocation API
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = L.latLng(latitude, longitude);
                setPosition(newPosition);
                
                // Get and set the address immediately
                const address = await getAddressFromCoordinates(latitude, longitude);
                setSearchQuery(address);
                
                setIsGettingLocation(false);
                toast.success("Current location selected!");
            },
            (error) => {
                setIsGettingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Location permission denied. Please enable location access.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Location information unavailable");
                        break;
                    case error.TIMEOUT:
                        toast.error("Location request timed out");
                        break;
                    default:
                        toast.error("Failed to get current location");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Update parent component when position changes
    useEffect(() => {
        if (position) {
            const updateLocation = async () => {
                setIsLoadingAddress(true);
                const address = await getAddressFromCoordinates(position.lat, position.lng);
                setFormattedAddress(address);
                onLocationSelect({
                    latitude: position.lat,
                    longitude: position.lng,
                    formattedAddress: address,
                });
                setIsLoadingAddress(false);
            };
            updateLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="space-y-4">
            {/* Search and Current Location Controls */}
            <div className="flex gap-2">
                <div className="flex-1 flex gap-2 relative" ref={searchContainerRef}>
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Search for a location in India..."
                            value={searchQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    searchLocation();
                                }
                            }}
                            onFocus={() => {
                                if (searchSuggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            className="flex-1"
                            disabled={isSearching}
                        />

                        {/* Autocomplete Suggestions Dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute z-9999 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {searchSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectSuggestion(suggestion)}
                                        className="w-full px-3 py-2 text-left hover:bg-accent text-sm border-b border-border last:border-b-0 transition-colors"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                            <span className="text-foreground">{suggestion.display_name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => searchLocation()}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2"
                >
                    <Navigation className="w-4 h-4" />
                    {isGettingLocation ? "Getting..." : "Current Location"}
                </Button>
            </div>

            {/* Selected Location Display */}
            {position && (
                <div className="p-3 bg-muted rounded-md text-sm">
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                        <div className="flex-1">
                            <p className="font-medium">Selected Location</p>
                            <p className="text-muted-foreground text-xs mt-1">
                                Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
                            </p>
                            {isLoadingAddress ? (
                                <p className="text-muted-foreground text-xs mt-1 italic">
                                    Getting address...
                                </p>
                            ) : formattedAddress ? (
                                <p className="text-foreground text-xs mt-1">
                                    {formattedAddress}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-border relative">
                <MapContainer
                    center={defaultCenter}
                    zoom={5}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController position={position} />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>

                {/* Locate Me Button Overlay */}
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="absolute bottom-4 right-4 z-1000 shadow-lg"
                    title="Use my current location"
                >
                    {isGettingLocation ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Locate className="w-4 h-4" />
                    )}
                </Button>
            </div>

            <p className="text-xs text-muted-foreground">
                Click on the map to select a location, search for an address, use the locate button on the map, or click "Current Location" above
            </p>
        </div>
    );
};
