"use client";
import React, { useState, useEffect } from "react";
import {
  AffiliateRegistrationRequest,
  AffiliateRegistrationResponse,
  AffiliateInfo,
  PaymentInfo,
} from "../types";
import AffiliateService from "../services/affiliateService";

interface AffiliateRegistrationProps {
  user: any;
  onRegistrationSuccess: (affiliateInfo: AffiliateInfo) => void;
}

const AffiliateRegistration: React.FC<AffiliateRegistrationProps> = ({
  user,
  onRegistrationSuccess,
}) => {
  const [formData, setFormData] = useState<AffiliateRegistrationRequest>({
    commissionRate: 8,
    paymentInfo: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      bankCode: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingAffiliate, setExistingAffiliate] =
    useState<AffiliateInfo | null>(null);

  // Danh sách ngân hàng phổ biến
  const popularBanks = [
    "Vietcombank",
    "BIDV",
    "Agribank",
    "VietinBank",
    "Techcombank",
    "MB Bank",
    "ACB",
    "Sacombank",
    "TPBank",
    "VPBank",
    "HDBank",
    "SHB",
    "SeABank",
    "VIB",
    "MSB",
  ];

  useEffect(() => {
    checkExistingAffiliate();
  }, []);

  const checkExistingAffiliate = async () => {
    try {
      const token = localStorage.getItem("nhattin_token");
      if (!token) return;

      const response = await AffiliateService.getAffiliateProfile();

      setExistingAffiliate(response);
    } catch (error: any) {
      // Nếu không có affiliate, không cần xử lý lỗi
      console.log("User chưa đăng ký affiliate");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("paymentInfo.")) {
      const field = name.replace("paymentInfo.", "") as keyof PaymentInfo;
      setFormData((prev) => ({
        ...prev,
        paymentInfo: {
          ...prev.paymentInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "commissionRate" ? Number(value) : value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (formData.commissionRate < 1 || formData.commissionRate > 15) {
      setError("Tỷ lệ hoa hồng phải từ 1% đến 15%");
      return false;
    }

    if (!formData.paymentInfo.bankName.trim()) {
      setError("Vui lòng nhập tên ngân hàng");
      return false;
    }

    if (!formData.paymentInfo.accountNumber.trim()) {
      setError("Vui lòng nhập số tài khoản");
      return false;
    }

    if (!formData.paymentInfo.accountHolder.trim()) {
      setError("Vui lòng nhập tên chủ tài khoản");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("nhattin_token");
      if (!token) {
        setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await AffiliateService.registerAffiliate(formData);

      setSuccess("Đăng ký affiliate thành công!");

      // Tạo affiliate info để truyền về parent component
      const affiliateInfo: AffiliateInfo = {
        userId: user._id,
        affiliateCode: response.affiliateCode,
        commissionRate: response.commissionRate,
        status: response.status as any,
        minPayoutAmount: response.minPayoutAmount,
        totalEarnings: 0,
        pendingEarnings: 0,
        paymentInfo: formData.paymentInfo,
      };

      onRegistrationSuccess(affiliateInfo);

      // Reset form
      setFormData({
        commissionRate: 8,
        paymentInfo: {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          bankCode: "",
        },
      });
    } catch (error: any) {
      console.error("Lỗi đăng ký affiliate:", error);
      setError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu đã có affiliate, hiển thị thông tin
  if (existingAffiliate) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🎯 Thông Tin Affiliate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mã Affiliate
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <code className="text-lg font-mono text-blue-600">
                  {existingAffiliate.affiliateCode}
                </code>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Tỷ lệ hoa hồng
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="text-lg font-semibold text-green-600">
                  {existingAffiliate.commissionRate}%
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Trạng thái
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    existingAffiliate.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : existingAffiliate.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {existingAffiliate.status === "ACTIVE"
                    ? "Đang hoạt động"
                    : existingAffiliate.status === "PENDING"
                    ? "Đang chờ duyệt"
                    : existingAffiliate.status === "INACTIVE"
                    ? "Không hoạt động"
                    : "Bị tạm khóa"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Ngân hàng
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                {existingAffiliate.paymentInfo.bankName}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Số tài khoản
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                {existingAffiliate.paymentInfo.accountNumber}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Chủ tài khoản
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                {existingAffiliate.paymentInfo.accountHolder}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            💡 <strong>Hướng dẫn sử dụng:</strong> Sử dụng mã affiliate của bạn
            để giới thiệu khách hàng. Bạn sẽ nhận được hoa hồng{" "}
            {existingAffiliate.commissionRate}% từ mỗi đơn hàng thành công.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🎯 Đăng Ký Affiliate
      </h3>

      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-800 mb-2">
          Thông tin về chương trình Affiliate:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Tỷ lệ hoa hồng: 1% - 15% (mặc định 8%)</li>
          <li>• Số tiền rút tối thiểu: 100,000 VNĐ</li>
          <li>• Nhận hoa hồng từ mỗi đơn hàng được giới thiệu</li>
          <li>• Thanh toán qua tài khoản ngân hàng</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tỷ lệ hoa hồng */}
        <div>
          <label
            htmlFor="commissionRate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tỷ lệ hoa hồng mong muốn (%)
          </label>
          <select
            id="commissionRate"
            name="commissionRate"
            value={formData.commissionRate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((rate) => (
              <option key={rate} value={rate}>
                {rate}% {rate === 8 ? "(Khuyến nghị)" : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Tỷ lệ hoa hồng từ 1% đến 15%. Tỷ lệ 8% được khuyến nghị để cân bằng
            lợi ích.
          </p>
        </div>

        {/* Thông tin ngân hàng */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800">
            Thông tin tài khoản ngân hàng
          </h4>

          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên ngân hàng *
            </label>
            <select
              id="bankName"
              name="paymentInfo.bankName"
              value={formData.paymentInfo.bankName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn ngân hàng</option>
              {popularBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
              <option value="other">Ngân hàng khác</option>
            </select>
          </div>

          {formData.paymentInfo.bankName === "other" && (
            <div>
              <label
                htmlFor="customBankName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên ngân hàng (tùy chỉnh)
              </label>
              <input
                type="text"
                id="customBankName"
                name="paymentInfo.bankName"
                value={
                  formData.paymentInfo.bankName === "other"
                    ? ""
                    : formData.paymentInfo.bankName
                }
                onChange={handleInputChange}
                placeholder="Nhập tên ngân hàng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số tài khoản *
            </label>
            <input
              type="text"
              id="accountNumber"
              name="paymentInfo.accountNumber"
              value={formData.paymentInfo.accountNumber}
              onChange={handleInputChange}
              placeholder="Nhập số tài khoản"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="accountHolder"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên chủ tài khoản *
            </label>
            <input
              type="text"
              id="accountHolder"
              name="paymentInfo.accountHolder"
              value={formData.paymentInfo.accountHolder}
              onChange={handleInputChange}
              placeholder="Nhập tên chủ tài khoản (đúng như trong sổ tiết kiệm)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bankCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mã ngân hàng (tùy chọn)
            </label>
            <input
              type="text"
              id="bankCode"
              name="paymentInfo.bankCode"
              value={formData.paymentInfo.bankCode}
              onChange={handleInputChange}
              placeholder="Ví dụ: VCB, BIDV, TCB..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Mã ngân hàng giúp xác định nhanh ngân hàng khi thanh toán
            </p>
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h5 className="font-medium text-yellow-800 mb-2">
            ⚠️ Lưu ý quan trọng:
          </h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Thông tin ngân hàng phải chính xác để nhận tiền</li>
            <li>• Tên chủ tài khoản phải trùng khớp với sổ tiết kiệm</li>
            <li>• Số tiền rút tối thiểu: 100,000 VNĐ</li>
            <li>
              • Affiliate code sẽ được tạo tự động sau khi đăng ký thành công
            </li>
          </ul>
        </div>

        {/* Nút đăng ký */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-md font-medium text-white transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng Ký Affiliate"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AffiliateRegistration;
