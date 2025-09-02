import { useState, useRef } from "react";
import { PiSpinnerBallDuotone } from "react-icons/pi";

const SpinningWheel = () => {
  const [showWheel, setShowWheel] = useState(false);
  const [names, setNames] = useState([]);
  const [input, setInput] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const getColor = (index) => {
    const colors = [
      "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", 
      "#f59e0b", "#10b981", "#06b6d4", "#84cc16"
    ];
    return colors[index % colors.length];
  };

  const handleAddName = () => {
    if (input.trim() !== "" && !names.includes(input.trim())) {
      setNames([...names, input.trim()]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddName();
    }
  };

  const handleRemoveName = (indexToRemove) => {
    setNames(names.filter((_, index) => index !== indexToRemove));
    setWinner("");
  };

  const handleSpinClick = () => {
    if (names.length === 0) {
      alert("Add at least one name first!");
      return;
    }

    setIsSpinning(true);
    setWinner("");

    // Generate random rotation (multiple full spins + random angle)
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);

    // Calculate winner based on final position
    const segmentAngle = 360 / names.length;
    const normalizedAngle = (360 - (totalRotation % 360)) % 360;
    const winnerIndex = Math.floor(normalizedAngle / segmentAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(names[winnerIndex]);
    }, 3000); // 3 second spin duration
  };

  const createWheelSegments = () => {
    if (names.length === 0) return null;

    const segmentAngle = 360 / names.length;
    const radius = 140;
    const center = 150;

    return names.map((name, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      // Convert to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      // Calculate path for segment
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Calculate text position
      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = center + textRadius * Math.cos((textAngle * Math.PI) / 180);
      const textY = center + textRadius * Math.sin((textAngle * Math.PI) / 180);

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={getColor(index)}
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x={textX}
            y={textY}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            {name.length > 8 ? name.substring(0, 8) + '...' : name}
          </text>
        </g>
      );
    });
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setShowWheel(true)}
        className="group relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Open Retro Starter Picker"
      >
        <PiSpinnerBallDuotone 
          size={32} 
          className="text-white group-hover:rotate-12 transition-transform duration-300" 
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </button>

      {/* Enhanced Responsive Modal */}
      {showWheel && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] relative overflow-hidden">
            
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
              <h2 className="text-2xl font-bold text-white text-center">
                Retro Starter Picker
              </h2>
              <button
                onClick={() => setShowWheel(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-red-500 transition-all duration-200"
              >
                ✕
              </button>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="flex flex-col lg:flex-row gap-6 h-full">
                
                {/* Left Panel - Names Management */}
                <div className="flex-1 lg:max-w-sm">
                  {/* Input Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Team Member
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter name..."
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 rounded-lg flex-1 transition-all duration-200 outline-none"
                        disabled={isSpinning}
                      />
                      <button
                        onClick={handleAddName}
                        disabled={!input.trim() || isSpinning}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Names List */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Members ({names.length})
                    </label>
                    {names.length > 0 ? (
                      <div className="max-h-64 lg:max-h-80 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3">
                        {names.map((name, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: getColor(index) }}
                              ></div>
                              <span className="text-sm font-medium text-gray-800">
                                {name}
                              </span>
                            </div>
                            {!isSpinning && (
                              <button
                                onClick={() => handleRemoveName(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <PiSpinnerBallDuotone size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No team members added yet</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {names.length > 0 && !isSpinning && (
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          setNames([]);
                          setWinner("");
                          setRotation(0);
                        }}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setWinner("")}
                        className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Reset Winner
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Panel - Wheel and Controls */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  {/* Custom Wheel */}
                  <div className="mb-6 relative">
                    {names.length > 0 ? (
                      <div className="relative">
                        {/* Wheel Container */}
                        <div className="relative w-80 h-80 md:w-96 md:h-96">
                          <svg
                            ref={wheelRef}
                            width="100%"
                            height="100%"
                            viewBox="0 0 300 300"
                            className="drop-shadow-xl"
                            style={{
                              transform: `rotate(${rotation}deg)`,
                              transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                            }}
                          >
                            {createWheelSegments()}
                            
                            {/* Center circle */}
                            <circle
                              cx="150"
                              cy="150"
                              r="20"
                              fill="white"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <circle
                              cx="150"
                              cy="150"
                              r="8"
                              fill="#6b7280"
                            />
                          </svg>
                          
                          {/* Pointer */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-80 h-80 md:w-96 md:h-96 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <PiSpinnerBallDuotone size={48} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Add names to see the wheel</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Spin Button */}
                  <button
                    onClick={handleSpinClick}
                    disabled={isSpinning || names.length === 0}
                    className={`w-full max-w-xs py-3 rounded-lg font-bold text-lg transition-all duration-300 transform ${
                      isSpinning || names.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    }`}
                  >
                    {isSpinning ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Spinning...
                      </span>
                    ) : (
                      "Spin the Wheel!"
                    )}
                  </button>

                  {/* Winner Display */}
                  {winner && !isSpinning && (
                    <div className="mt-6 w-full max-w-xs">
                      <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-l-4 border-green-500 animate-pulse">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Today's Retro Starter</p>
                          <p className="text-xl font-bold text-gray-800">{winner}</p>
                          <p className="text-sm text-gray-600 mt-1">Let's get this retro started! 🚀</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinningWheel;