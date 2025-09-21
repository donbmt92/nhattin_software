import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface OrderFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    paymentStatusFilter: string;
    onPaymentStatusFilterChange: (value: string) => void;
}

export default function OrderFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    paymentStatusFilter,
    onPaymentStatusFilterChange,
}: OrderFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Tìm kiếm theo ID, tên, SĐT..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái đơn hàng" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái thanh toán" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả thanh toán</SelectItem>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="COMPLETED">Đã thanh toán</SelectItem>
                    <SelectItem value="FAILED">Thanh toán thất bại</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
