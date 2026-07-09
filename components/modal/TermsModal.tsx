"use client";

import Button from "@/components/ui/Button";
import Modal from "./Modal";

type TermsModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function TermsModal({
  open,
  onClose,
  onAccept,
}: TermsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="📜 ข้อตกลงเงื่อนไขการใช้งาน (Terms of Service)"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section>
          <h3 className="text-xl font-bold">1. ข้อตกลงการใช้บริการ</h3>
          <p className="mt-2 leading-7">
            การสมัครสมาชิกและใช้งานระบบ HelmetPoint ถือว่าคุณยอมรับข้อตกลงและเงื่อนไขการใช้บริการของระบบหมวกนิรภัยอัจฉริยะ 
            รวมถึงยินยอมให้ระบบประมวลผลความเร็วและพิกัดการขับขี่เพื่อจุดประสงค์ด้านความปลอดภัย
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold">2. ความปลอดภัยและการแจ้งเตือน</h3>
          <p className="mt-2 leading-7">
            ระบบเซนเซอร์ตรวจหาความเคลื่อนไหวและการล้มฉุกเฉิน (SOS) ทำงานบนความน่าจะเป็นทางสถิติและเครือข่ายอินเทอร์เน็ตของอุปกรณ์ 
            ผู้พัฒนามุ่งมั่นอัปเดตระบบให้แม่นยำที่สุด แต่ไม่สามารถรับประกันความเสถียรในพื้นที่อับสัญญาณได้
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold">3. การดูแลรักษาบัญชี</h3>
          <p className="mt-2 leading-7">
            ผู้ใช้มีหน้าที่เก็บรักษารหัสผ่านและข้อมูลบัญชีให้เป็นความลับ 
            ห้ามนำอุปกรณ์ของบุคคลอื่นมาผูกมัดหรือลงทะเบียนเพื่อเจตนารบกวนความปลอดภัยของระบบ
          </p>
        </section>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline" onClick={onClose}>
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
