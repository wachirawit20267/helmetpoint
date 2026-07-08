"use client";

import Button from "@/components/ui/Button";
import Modal from "./Modal";

type PrivacyModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function PrivacyModal({
  open,
  onClose,
  onAccept,
}: PrivacyModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="🔒 นโยบายความเป็นส่วนตัว (Privacy Policy)"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">

        <section>
          <h3 className="text-xl font-bold">1. ข้อมูลที่เราเก็บ</h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>ชื่อ-นามสกุล</li>
            <li>อีเมล</li>
            <li>เบอร์โทรศัพท์</li>
            <li>ข้อมูลอุปกรณ์ HelmetPoint</li>
            <li>ตำแหน่ง GPS (เมื่อผู้ใช้อนุญาต)</li>
            <li>ข้อมูลการเดินทางและการใช้งาน</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold">2. การใช้ข้อมูล</h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>แสดงข้อมูลบน Dashboard</li>
            <li>ติดตามการเดินทาง</li>
            <li>แจ้งเหตุฉุกเฉิน</li>
            <li>วิเคราะห์ความปลอดภัยในการขับขี่</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold">3. ความปลอดภัยของข้อมูล</h3>

          <p className="mt-3 leading-7">
            HelmetPoint ให้ความสำคัญกับความปลอดภัยของข้อมูล
            โดยจะจัดเก็บข้อมูลอย่างเหมาะสมและไม่เปิดเผยแก่บุคคลภายนอก
            เว้นแต่ได้รับความยินยอมจากผู้ใช้หรือเป็นไปตามกฎหมาย
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold">4. สิทธิของผู้ใช้</h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>ขอแก้ไขข้อมูลส่วนตัว</li>
            <li>ลบบัญชีผู้ใช้</li>
            <li>ขอลบข้อมูลการใช้งาน</li>
            <li>ถอนความยินยอมในการใช้ข้อมูล</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold">5. การติดต่อ</h3>

          <p className="mt-3">
            หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว
            สามารถติดต่อทีมพัฒนา HelmetPoint ได้ตลอดเวลา
          </p>
        </section>

        <div className="flex justify-end gap-4 pt-6">

          <Button
            variant="outline"
            onClick={onClose}
          >
            ปิด
          </Button>

          <Button
            onClick={() => {
              onAccept();
              onClose();
            }}
          >
            ฉันยอมรับ
          </Button>

        </div>

      </div>
    </Modal>
  );
}