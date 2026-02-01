import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        User Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Profile settings management coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
