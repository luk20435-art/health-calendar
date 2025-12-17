"use client";
import { useState } from "react";
import { Heart, User, ClipboardList } from "lucide-react";

type FormDataState = {
  section1: Record<string, string>;
  section2: Record<string, string>;
};

export default function HealthBehaviorSurvey() {
  const [formData, setFormData] = useState<FormDataState>({
    section1: { fullName: "", age: "", gender: "" },
    section2: {},
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (section: keyof FormDataState, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSection2Change = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, section2: { ...prev.section2, [questionId]: value } }));
  };

  // ✅ คำถามใหม่ 8 ข้อ พร้อมหมวด
  const behaviorQuestions = [
    {
      category: "ด้านการควบคุมอาหาร",
      questions: [
        "คุณรับประทานอาหารที่มีรสเค็ม (เช่น ปลาเค็ม ปลาร้า ไข่เค็ม ผักดอง) กี่วันต่อสัปดาห์?",
        "คุณเติมน้ำปลา/ซอสปรุงรสเพิ่มในอาหาร 3-6 มื้อ กี่วันต่อสัปดาห์?",
        "คุณรับประทานผักและผลไม้ที่มีเส้นใยสูง (เช่น ส้ม แตงโม กล้วย ผักใบเขียว) กี่วันต่อสัปดาห์?",
      ],
      options: [
        "ไม่ปฏิบัติ",
        "ปฏิบัติ 1 - 2 วัน/สัปดาห์",
        "ปฏิบัติ 3 - 4 วัน/สัปดาห์",
        "ปฏิบัติ 5 - 7 วัน/สัปดาห์",
      ],
    },
    {
      category: "ด้านการออกกำลังกาย",
      questions: ["คุณออกกำลังกายอย่างน้อย 30 นาที (เช่น เดิน วิ่ง เต้นแอโรบิค เล่นโยคะ) กี่วันต่อสัปดาห์?"],
      options: ["ไม่ปฏิบัติ", "1 - 2 วัน/สัปดาห์", "3 - 4 วัน/สัปดาห์", "5 - 7 วัน/สัปดาห์"],
    },
    {
      category: "ด้านการผ่อนคลายความเครียด",
      questions: [
        "คุณทำกิจกรรมผ่อนคลายความเครียด (เช่น เดินเล่น นั่งสมาธิ ฟังเพลง) กี่วันต่อสัปดาห์?",
        "คุณนอนหลับวันละ 7–8 ชั่วโมง กี่วันต่อสัปดาห์?",
      ],
      options: ["ไม่ปฏิบัติ", "1 - 2 วัน/สัปดาห์", "3 - 4 วัน/สัปดาห์", "5 - 7 วัน/สัปดาห์"],
    },
    {
      category: "ด้านการควบคุมการสูบบุหรี่",
      questions: ["คุณสูบบุหรี่ กี่วันต่อสัปดาห์?"],
      options: ["ไม่สูบ", "1 - 2 วัน/สัปดาห์", "3 - 4 วัน/สัปดาห์", "5 - 7 วัน/สัปดาห์"],
    },
    {
      category: "ด้านการควบคุมการดื่มสุรา",
      questions: ["คุณดื่มสุรา กี่วันต่อสัปดาห์?"],
      options: ["ไม่ดื่ม", "1 - 2 วัน/สัปดาห์", "3 - 4 วัน/สัปดาห์", "5 - 7 วัน/สัปดาห์"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycby1rU8FYvST49GUHrT6QGDr2lLoAo3QQEBDs-3iOsVHrnkh3pcIaPxzuthLy7KG8rcS/exec";

      const flatData: Record<string, string> = {};

      // แปลงข้อมูล section1
      Object.entries(formData.section1).forEach(([key, value]) => {
        flatData[`section1_${key}`] = value;
      });

      // แปลงข้อมูล section2
      Object.entries(formData.section2).forEach(([key, value]) => {
        flatData[`section2_${key}`] = value;
      });

      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (Object.keys(flatData).length === 0) {
        setResult("❌ ไม่มีข้อมูลให้ส่ง");
        setLoading(false);
        return;
      }

      // ส่งข้อมูลไป Google Sheets
      const urlSearchParams = new URLSearchParams(flatData);
      const res = await fetch(scriptURL, { method: "POST", body: urlSearchParams });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();

      // แสดงผลลัพธ์ภาษาไทย
      if (json.success) {
        setResult("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
        // เคลียร์ฟอร์มถ้าต้องการ
        setFormData({ section1: { fullName: "", age: "", gender: "" }, section2: {} });
      } else {
        setResult("❌ เกิดข้อผิดพลาด: " + (json.error || "ไม่ทราบสาเหตุ"));
      }
    } catch (err: unknown) {
      setResult("❌ การส่งข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            แบบประเมินพฤติกรรมสุขภาพ
          </h1>
          <p className="text-gray-600">โปรดเลือกคำตอบที่ตรงกับพฤติกรรมของท่านมากที่สุด</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1 */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" /> ข้อมูลส่วนตัว
            </h2>
            {["fullName", "age", "gender"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="font-medium text-gray-700">
                  {field === "fullName"
                    ? "ชื่อ-สกุล"
                    : field === "age"
                      ? "อายุ (ปี)"
                      : "เพศ"}
                </label>
                <input
                  type="text"
                  value={formData.section1[field] || ""}
                  onChange={(e) => handleChange("section1", field, e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Section 2: Questions */}
          <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-pink-500" /> แบบสอบถามพฤติกรรมสุขภาพ
            </h2>

            {behaviorQuestions.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-pink-600">{group.category}</h3>
                {group.questions.map((q, qIndex) => (
                  <div key={qIndex} className="flex flex-col space-y-1">
                    <label className="text-gray-700">{q}</label>
                    <select
                      value={formData.section2[`q${groupIndex}_${qIndex}`] || ""}
                      onChange={(e) =>
                        handleSection2Change(`q${groupIndex}_${qIndex}`, e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="">เลือกคำตอบ</option>
                      {group.options.map((opt, optIndex) => (
                        <option key={optIndex} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "กำลังส่ง..." : "ส่งข้อมูล"}
            </button>
            {result && <p className="mt-4">{result}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
