import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, Clock, MapPin } from 'lucide-react';

const OfferScarcityBar = ({ stock = 2 }) => {
  const [stats, setStats] = useState({
    viewing: 2,
    recentActivity: 'Sarah from Los Angeles'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Sarah', 'Michael', 'Jessica', 'David', 'Emma'];
      const cities = ['Los Angeles', 'San Francisco', 'San Diego', 'Irvine', 'Pasadena'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      setStats({
        viewing: Math.floor(Math.random() * 3) + 1,
        recentActivity: `${randomName} from ${randomCity}`
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-bold text-blue-600">{stats.viewing}</div>
              <div className="text-xs text-gray-600">viewing now</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-bold text-red-600">{stock}</div>
              <div className="text-xs text-gray-600">units left</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-gray-700">
            <strong>{stats.recentActivity}</strong> just viewed this
          </span>
          <span className="text-gray-500">23 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default OfferScarcityBar;
