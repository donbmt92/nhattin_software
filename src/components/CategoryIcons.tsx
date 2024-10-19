import { FaGamepad, FaChartLine, FaCloud, FaGraduationCap, FaTheaterMasks, FaMusic } from 'react-icons/fa';
import { AiOutlineSafetyCertificate, AiOutlineRobot } from 'react-icons/ai';

const categories = [
    { icon: <AiOutlineRobot size={52} />, label: 'AI' },
    { icon: <FaGamepad size={52} />, label: 'GAME' },
    { icon: <FaChartLine size={52} />, label: 'GIAO DỊCH' },
    { icon: <AiOutlineSafetyCertificate size={52} />, label: 'BẢO MẬT' },
    { icon: <FaCloud size={52} />, label: 'LƯU TRỮ ĐÁM MÂY' },
    { icon: <FaGraduationCap size={52} />, label: 'HỌC TẬP' },
    { icon: <FaTheaterMasks size={52} />, label: 'GIẢI TRÍ' },
    { icon: <FaMusic size={52} />, label: 'NGHE NHẠC' },
];

const CategoryIcons = () => {
    return (
        <div className="bg-gray-100 py-8">
            <div className="container mx-auto flex justify-center space-x-20">
                {categories.map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                        <div className="text-black">{item.icon}</div>
                        <p className="text-base font-semibold text-black">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryIcons;
