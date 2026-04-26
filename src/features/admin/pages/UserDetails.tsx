
import React from 'react';

interface UserDetailsProps {
  user: any;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-6 text-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p className="font-semibold">اسم الشركة:</p>
          <p className="text-gray-600">{user.company_name || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">رقم التسجيل:</p>
          <p className="text-gray-600">{user.registration_number || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">عدد الموظفين التقريبي:</p>
          <p className="text-gray-600">{user.approx_employee_count || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">نشاط الشركة:</p>
          <p className="text-gray-600">{user.business_activity || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">الشخص المسؤول:</p>
          <p className="text-gray-600">{user.responsible_person || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">رقم الهاتف:</p>
          <p className="text-gray-600">{user.first_phone_number || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">الوظيفة:</p>
          <p className="text-gray-600">{user.responsible_position || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">الشخص الثاني المسؤول:</p>
          <p className="text-gray-600">{user.second_responsible_person || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">رقم الهاتف الثاني:</p>
          <p className="text-gray-600">{user.second_phone_number || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">المنطقة المفضلة:</p>
          <p className="text-gray-600">{user.favorite_area || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">حالة الحساب:</p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : user.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {user.status}
          </span>
        </div>

        <div>
          <p className="font-semibold">تاريخ الإنشاء:</p>
          <p className="text-gray-600">
            {new Date(user.created_at).toLocaleString('ar-EG')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
