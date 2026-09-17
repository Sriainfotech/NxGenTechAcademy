import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { demoService, DemoFormCourse } from "@/services/demoService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DemoSidebarCardProps {
    courseTitle?: string;
}

const DemoSidebarCard = ({ courseTitle }: DemoSidebarCardProps) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [courses, setCourses] = useState<DemoFormCourse[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        course: courseTitle || "",
    });

    useEffect(() => {
        let isMounted = true;

        demoService.getFormCourses()
            .then((data) => {
                if (!isMounted) return;
                setCourses(data);

                // Default to the course this sidebar was opened for, matched
                // by name against the fetched list; fall back to the first
                // course if there's no match (or none was passed in).
                const matched = courseTitle
                    ? data.find((c) => c.name.toLowerCase() === courseTitle.toLowerCase())
                    : undefined;
                setFormData((prev) => ({
                    ...prev,
                    course: matched?.name || courseTitle || data[0]?.name || "",
                }));
            })
            .catch((error) => {
                console.error("Failed to load demo courses:", error);
                // Keep the form usable even if the course list can't be
                // fetched, falling back to just the current page's course.
            })
            .finally(() => {
                if (isMounted) setCoursesLoading(false);
            });

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseTitle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCourseChange = (value: string) => {
        setFormData({
            ...formData,
            course: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await demoService.bookDemo(formData);
            toast.success("Demo request submitted successfully!");
            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Demo Booking Error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const courseOptions = courses.length > 0
        ? courses
        : courseTitle
            ? [{ id: 0, name: courseTitle, slug: "" }]
            : [];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300">
            {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Your demo request has been received. Our team will contact you shortly.
                    </p>
                    <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-[#000080] hover:bg-[#000080]/90 text-white font-bold px-8 h-10 rounded-md transition-all font-sans"
                    >
                        OK
                    </Button>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Book a Free Demo</h3>
                    <p className="text-sm text-gray-500 mb-6 font-sans">Experience our expert-led training firsthand.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sidebar-demo-full_name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                                <Input
                                    id="sidebar-demo-full_name"
                                    name="full_name"
                                    placeholder="Enter your name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sidebar-demo-email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                <Input
                                    id="sidebar-demo-email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sidebar-demo-phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                <Input
                                    id="sidebar-demo-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Course</Label>
                                <Select
                                    value={formData.course}
                                    onValueChange={handleCourseChange}
                                    disabled={coursesLoading && courseOptions.length === 0}
                                    required
                                >
                                    <SelectTrigger className="h-11 border-gray-200">
                                        <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseOptions.map((course) => (
                                            <SelectItem key={course.id || course.name} value={course.name}>
                                                {course.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white font-bold h-12 text-lg shadow-md transition-all rounded-md"
                                disabled={isSubmitting || !formData.course}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default DemoSidebarCard;
