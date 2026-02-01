import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Finance = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Finance & Growth</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Finance Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Financial analytics dashboard coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Finance;
