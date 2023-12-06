"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VoterDropzone } from "./VoterDropzone";
import { useState, useEffect } from "react";
import { Campus, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { signIn } from "next-auth/react";

type VoterDetail = {
    user: Partial<User>;
    voterId: number;
    weight: number;
  };
  

export function VoterModal() {
  const [voters, setVoters] = useState<VoterDetail[]>([]);
  
  const { id } = useParams();

  
  //Reset the voters state
  const resetVoters = () => {
    setVoters([]);
  };

  const onSubmit = async () => {

    const res = await fetch(`/api/admin/voters`, {
      method: "POST",
      body: JSON.stringify({ voters, electionId: id }),
    });
    const data = await res.json();
    console.log(data)
    data.successfulInvites.forEach((user) => {
      signIn("email", {
        email: user.email,
        callbackUrl: `${window.location.origin}/vote`,
        redirect: false,
      });
    });
  };



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite voters</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Invite voters</DialogTitle>
          <DialogDescription>
            Here you are able to invite voters, with the capability to Preview & Edit before sending.
          </DialogDescription>
        </DialogHeader>
        {voters.length === 0 ? (
                        <VoterDropzone voters={voters} setVoters={setVoters} />
                    ) : null}
          <Table className="w-full overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Voter ID</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            {voters.length > 0 ? (
            <TableBody>
              {voters.map((voterDetail, index) => (
                <TableRow key={index}>
                    <TableCell>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={voterDetail.user?.email || ""}
                        onChange={(e) => {
                        const newVoters = [...voters];
                        newVoters[index].user.email = e.target.value;
                        setVoters(newVoters);
                        }}
                    />
                    </TableCell>

                  <TableCell>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={voterDetail.user?.name || ""}
                      onChange={(e) => {
                        const newVoters = [...voters];
                        newVoters[index].user.name = e.target.value;
                        setVoters(newVoters);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      name="campus"
                      placeholder="Campus"
                      value={voterDetail.user?.campus || ""}
                      onChange={(e) => {
                        const newVoters = [...voters];
                        newVoters[index].user.campus = e.target.value as Campus;
                        setVoters(newVoters);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      name="voter_id"
                      placeholder="Voter ID"
                      value={voterDetail.voterId || ""}
                      onChange={(e) => {
                        const newVoters = [...voters];
                        newVoters[index].voterId = parseInt(e.target.value);
                        setVoters(newVoters);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      name="weight"
                      placeholder="Weight"
                      value={voterDetail.weight || ""}
                      onChange={(e) => {
                        const newVoters = [...voters];
                        newVoters[index].weight = parseInt(e.target.value);
                        setVoters(newVoters);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            ) : null}
          </Table>
        <DialogFooter>
          <Button variant="outline" onClick={resetVoters}>
            Reset
          </Button>
          <Button onClick={onSubmit}>Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
