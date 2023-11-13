"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { User } from "@prisma/client"
import { Election,  } from "@/lib/types/Election"
import { useRouter, usePathname } from 'next/navigation'
import { useSelectedElection } from "@/lib/context/ElectionContext"
import { VotersWithElections } from "@/lib/types/Election"
import { useToast } from "@/components/ui/use-toast"

type Team = {
  label: string
  value: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [electionName, setElectionName] = React.useState("");
  const [electionDate, setElectionDate] = React.useState("");
  const [electionCampus, setElectionCampus] = React.useState("");



  const { data: session } = useSession()

  const isAdmin = session?.user?.role === 'ADMIN';

  
  const { toast } = useToast()

  const router = useRouter();
  const pathname = usePathname();


  const [groups, setGroups] = React.useState([
    {
      label: "Your elections",
      teams: [
        {
          label: "Not found",
          value: "not-found",
        }
      ],
    },
    {
      label: "Other elections",
      teams: [
        {
          label: "Not found",
          value: "not-found",
        }
      ],
    },
  ])
  const { selectedElection, setSelectedElection } = useSelectedElection() as { selectedElection: Election | null, setSelectedElection: (value: any) => {} };

  React.useEffect(() => {
    fetch('/api/admin/elections')
        .then(response => response.json())
        .then(data => {
          //Response example: { myElections: [election1, election2, ...], allElections: [] }
          const myElections = data.myElections;
          const allElections = data.allElections;

          const myElectionsArray = myElections.map((election: Election) => {
            return {
              label: election.name,
              value: election.id,
            }
          });

          const allElectionsArray = allElections.map((election: Election) => {
            return {
              label: election.name,
              value: election.id,
            }
          });

          setGroups([
            {
              label: "Your elections",
              teams: myElectionsArray.length ? myElectionsArray : [{ label: "No elections found", value: "not-found" }],
            },
            ...isAdmin ? [{
              label: "Other elections",
              teams: allElectionsArray.length ? allElectionsArray : [{ label: "No elections found", value: "not-found" }],
            }] : [],
          ])
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [selectedElection, isAdmin])

  
  const onSubmit = (event: any) => {
    event.preventDefault();

    const isoDate = `${electionDate}T00:00:00Z`; 
  
    fetch('/api/admin/elections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: electionName,
        campus: electionCampus,
        date: isoDate,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const selectedElection = {
        id: data.id,
        label: electionName, // Assuming this is the label of the election
      };
      setSelectedElection(selectedElection);
      localStorage.setItem('selectedElection', JSON.stringify(selectedElection));
      router.push(`/admin/${data.id}`)
      toast({
        title: "Election created",
        variant: "default",
        description: "You will be redirected to the new election page, where you can manage the election."
      })
    })
    .catch((error) => {
      console.error('Error:', error);
      toast({
        title: "Error",
        variant: "success",
        description: "Something went wrong. Please try again later."
      })
    });
    setShowNewTeamDialog(false);
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an election"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {pathname === "/admin" ? "Select Election" : (selectedElection as any)?.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search election..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedElection(team)
                        localStorage.setItem('selectedElection', team.value);
                        setOpen(false)
                        router.push(`/admin/${team.value}`)
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedElection?.id === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Election
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Election</DialogTitle>
          <DialogDescription>
            You will be redirected to the new election page, where you can manage the election.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Election name</Label>
              <Input id="name" type="text" value={electionName} onChange={(e) => setElectionName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Campus</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a campus" className="w-full" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                  <SelectItem value="bergen">Bergen</SelectItem>
                  <SelectItem value="oslo">Oslo</SelectItem>
                  <SelectItem value="stavanger">Stavanger</SelectItem>
                  <SelectItem value="trondheim">Trondheim</SelectItem>
                </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={electionDate} onChange={(e) => setElectionDate(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}