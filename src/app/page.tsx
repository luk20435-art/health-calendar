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

  const handleChange = (
    section: keyof FormDataState,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSection2Change = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      section2: { ...prev.section2, [questionId]: value },
    }));
  };

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
      default: "ไม่ปฏิบัติ",
    },
    {
      category: "ด้านการออกกำลังกาย",
      questions: [
        "คุณออกกำลังกายอย่างน้อย 30 นาที (เช่น เดิน วิ่ง เต้นแอโรบิค เล่นโยคะ) กี่วันต่อสัปดาห์?",
      ],
      options: [
        "ไม่ปฏิบัติ",
        "1 - 2 วัน/สัปดาห์",
        "3 - 4 วัน/สัปดาห์",
        "5 - 7 วัน/สัปดาห์",
      ],
      default: "ไม่ปฏิบัติ",
    },
    {
      category: "ด้านการผ่อนคลายความเครียด",
      questions: [
        "คุณทำกิจกรรมผ่อนคลายความเครียด (เช่น เดินเล่น นั่งสมาธิ ฟังเพลง) กี่วันต่อสัปดาห์?",
        "คุณนอนหลับวันละ 7–8 ชั่วโมง กี่วันต่อสัปดาห์?",
      ],
      options: [
        "ไม่ปฏิบัติ",
        "1 - 2 วัน/สัปดาห์",
        "3 - 4 วัน/สัปดาห์",
        "5 - 7 วัน/สัปดาห์",
      ],
      default: "ไม่ปฏิบัติ",
    },
    {
      category: "ด้านการควบคุมการสูบบุหรี่",
      questions: ["คุณสูบบุหรี่ กี่วันต่อสัปดาห์?"],
      options: [
        "ไม่สูบ",
        "1 - 2 วัน/สัปดาห์",
        "3 - 4 วัน/สัปดาห์",
        "5 - 7 วัน/สัปดาห์",
      ],
      default: "ไม่สูบ",
    },
    {
      category: "ด้านการควบคุมการดื่มสุรา",
      questions: ["คุณดื่มสุรา กี่วันต่อสัปดาห์?"],
      options: [
        "ไม่ดื่ม",
        "1 - 2 วัน/สัปดาห์",
        "3 - 4 วัน/สัปดาห์",
        "5 - 7 วัน/สัปดาห์",
      ],
      default: "ไม่ดื่ม",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      // URL ใหม่ล่าสุดของคุณ (อัปเดต 25 ธ.ค. 2025)
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbwBzy2sZjcP7U-ypsGQiZFT-V9gKLtsPSit_JUUJCfCjmxv9c5v98woWz4WjHw5q-hh/exec";

      const flatData: Record<string, string> = {};

      // ข้อมูลส่วนตัว
      Object.entries(formData.section1).forEach(([key, value]) => {
        flatData[`section1_${key}`] = value.trim();
      });

      // คำตอบแบบสอบถาม
      Object.entries(formData.section2).forEach(([key, value]) => {
        flatData[`section2_${key}`] = value;
      });

      // ส่งข้อมูล (no-cors เพื่อหลีกเลี่ยง CORS)
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(flatData),
      });

      setResult("✅ บันทึกข้อมูลเรียบร้อยแล้ว ขอบคุณที่ร่วมตอบแบบสอบถาม ❤️");

      // รีเซ็ตฟอร์ม
      setFormData({
        section1: { fullName: "", age: "", gender: "" },
        section2: {},
      });
    } catch (err) {
      console.error("Error:", err);
      setResult("❌ การส่งข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* หัวข้อหลัก */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            แบบประเมินพฤติกรรมสุขภาพ
          </h1>
          <p className="text-gray-600 text-lg">
            โปรดกรอกข้อมูลและเลือกคำตอบที่ตรงกับพฤติกรรมของท่านมากที่สุด
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ข้อมูลส่วนตัว */}
          <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-pink-500" />
              ข้อมูลส่วนตัว
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">
                  ชื่อ-สกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.section1.fullName}
                  onChange={(e) => handleChange("section1", "fullName", e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="ชื่อ นามสกุล"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">
                  อายุ (ปี) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.section1.age}
                  onChange={(e) => handleChange("section1", "age", e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="เช่น 35"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">
                  เพศ <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.section1.gender}
                  onChange={(e) => handleChange("section1", "gender", e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ / ไม่ระบุ</option>
                </select>
              </div>
            </div>
          </div>

          {/* แบบสอบถาม */}
          <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg space-y-8">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-pink-500" />
              แบบสอบถามพฤติกรรมสุขภาพ
            </h2>

            {behaviorQuestions.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="space-y-6 pt-6 border-t border-gray-200 first:border-t-0 first:pt-0"
              >
                <h3 className="text-xl font-bold text-pink-600">{group.category}</h3>
                {group.questions.map((q, qIndex) => {
                  const questionKey = `q${groupIndex}_${qIndex}`;
                  const defaultValue = group.default || group.options[0];

                  return (
                    <div key={qIndex} className="space-y-2">
                      <label className="text-gray-800 font-medium">{q}</label>
                      <select
                        required
                        value={formData.section2[questionKey] || defaultValue}
                        onChange={(e) =>
                          handleSection2Change(questionKey, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ปุ่มส่ง */}
          <div className="text-center space-y-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-xl px-10 py-5 rounded-full shadow-xl hover:from-pink-600 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition duration-300"
            >
              {loading ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"}
            </button>

            {result && (
              <p
                className={`text-2xl font-bold animate-pulse ${
                  result.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {result}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}